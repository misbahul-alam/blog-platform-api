import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DRIZZLE } from 'src/database/database.module';
import type { DrizzleDB } from 'src/database/types/drizzle';
import { eq, isNull } from 'drizzle-orm';
import { categories } from 'src/database/schema/categories.schema';

@Injectable()
export class CategoriesService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const { name, slug, parentId } = createCategoryDto;

    const exitingCategory = await this.db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug));

    if (exitingCategory.length > 0) {
      throw new ConflictException('Category with this slug already exists');
    }

    const newCategory = (await this.db
      .insert(categories)
      .values({ name, slug, parentId })
      .returning()) as any[];

    if (newCategory.length !== 1) {
      throw new ConflictException('Failed to create category');
    }

    return {
      message: 'Category created successfully',
      category: newCategory[0],
    };
  }

  async findAll() {
    const categoryList = await this.db.query.categories.findMany({
      where: isNull(categories.parentId),
      with: { children: true },
    });
    return categoryList;
  }

  async findOne(id: number) {
    const category = await this.db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    if (category.length === 0) {
      throw new NotFoundException('Category not found');
    }
    return category[0];
  }

  async findOneBySlug(slug: string) {
    const category = await this.db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);
    if (category.length === 0) {
      throw new NotFoundException('Category not found');
    }
    return category[0];
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const updateData: Partial<typeof categories.$inferInsert> = {};

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.slug !== undefined) updateData.slug = dto.slug;
    if (dto.parentId !== undefined) updateData.parentId = dto.parentId;

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    const result = await this.db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning({ id: categories.id });

    if (result.length === 0) {
      throw new NotFoundException('Category not found');
    }

    return {
      message: 'Category updated successfully',
    };
  }

  async remove(id: number) {
    const result = await this.db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning({ id: categories.id });

    if (result.length === 0) {
      throw new NotFoundException('Category not found');
    }

    return {
      message: 'Category deleted successfully',
    };
  }
}
