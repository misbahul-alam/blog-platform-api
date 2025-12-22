import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DRIZZLE } from 'src/database/database.module';
import type { DrizzleDB } from 'src/database/types/drizzle';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { eq } from 'drizzle-orm';
import { posts } from 'src/database/schema/posts.schema';

@Injectable()
export class PostsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}
  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    const posts = await this.db.query.posts.findMany({
      with: {
        category: {
          columns: { name: true, slug: true },
        },
        author: {
          columns: { firstName: true, lastName: true, email: true },
        },
        tags: {
          with: {
            tag: { columns: { name: true, slug: true } },
          },
        },
      },
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      limit,
      offset: (page - 1) * limit,
    });

    console.log(posts);
    const formattedPosts = posts.map((post) => ({
      ...post,
      tags: post.tags.map((t) => t.tag),
    }));
    return {
      limit,
      page,
      data: formattedPosts,
    };
  }

  async findOne(id: number) {
    const post = await this.db.query.posts.findFirst({
      where: eq(posts.id, id),
      with: {
        category: {
          columns: { name: true, slug: true },
        },
        author: {
          columns: { firstName: true, lastName: true, email: true },
        },
        tags: {
          with: {
            tag: { columns: { name: true, slug: true } },
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException({ message: `Post with ID ${id} not found` });
    }

    return { ...post, tags: post.tags.map((t) => t.tag) };
  }

  async findOneBySlug(slug: string) {
    const post = await this.db.query.posts.findFirst({
      where: eq(posts.slug, slug),
      with: {
        category: {
          columns: { name: true, slug: true },
        },
        author: {
          columns: { firstName: true, lastName: true, email: true },
        },
        tags: {
          with: {
            tag: { columns: { name: true, slug: true } },
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException({
        message: `Post with slug ${slug} not found`,
      });
    }

    return {
      ...post,
      tags: post.tags.map((t) => t.tag),
    };
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(id: number) {
    const result = await this.db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning({ deletedId: posts.id });

    if (result.length === 0) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return { message: `Post with ID ${id} deleted successfully` };
  }
}
