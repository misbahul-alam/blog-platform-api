import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DRIZZLE } from 'src/database/database.module';
import type { DrizzleDB } from 'src/database/types/drizzle';
import { CreateTagDto } from './dto/create-tag.dto';
import { tags } from 'src/database/schema/tags.schema';
import { eq } from 'drizzle-orm';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class TagsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async create(createTagDto: CreateTagDto) {
    const { name, slug } = createTagDto;

    const existingTag = await this.db.query.tags.findFirst({
      where: eq(tags.slug, slug),
    });

    if (existingTag) {
      throw new ConflictException('Tag with this slug already exists');
    }

    const [tag] = await this.db
      .insert(tags)
      .values({
        name,
        slug,
      })
      .returning();

    return {
      message: 'Tag created successfully',
      data: tag,
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const limitNum = limit || 10;
    const pageNum = page || 1;

    const allTags = await this.db.query.tags.findMany({
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
    });

    return {
      data: allTags,
      page: pageNum,
      limit: limitNum,
    };
  }

  async findOne(id: number) {
    const tag = await this.db.query.tags.findFirst({
      where: eq(tags.id, id),
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return tag;
  }

  async findOneBySlug(slug: string) {
    const tag = await this.db.query.tags.findFirst({
      where: eq(tags.slug, slug),
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    await this.findOne(id);

    if (updateTagDto.slug) {
      const existingTag = await this.db.query.tags.findFirst({
        where: eq(tags.slug, updateTagDto.slug),
      });

      if (existingTag && existingTag.id !== id) {
        throw new ConflictException('Tag with this slug already exists');
      }
    }

    const [updatedTag] = await this.db
      .update(tags)
      .set(updateTagDto)
      .where(eq(tags.id, id))
      .returning();

    return {
      message: 'Tag updated successfully',
      data: updatedTag,
    };
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.db.delete(tags).where(eq(tags.id, id));

    return {
      message: 'Tag deleted successfully',
    };
  }
}
