import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DRIZZLE } from 'src/database/database.module';
import type { DrizzleDB } from 'src/database/types/drizzle';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { eq, ilike, or, and } from 'drizzle-orm';
import { posts } from 'src/database/schema/posts.schema';
import { postLikes } from 'src/database/schema/likes.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { categories } from 'src/database/schema/categories.schema';

@Injectable()
export class PostsService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async create(
    createPostDto: CreatePostDto,
    authorId: number,
    image: Express.Multer.File,
  ) {
    const { title, slug, content, excerpt, categoryId, status } = createPostDto;

    const categoryExists = await this.db.query.categories.findFirst({
      where: eq(categories.id, categoryId),
    });

    if (!categoryExists) {
      throw new BadRequestException({
        message: `Invalid category ID: ${categoryId}`,
      });
    }

    const slugExists = await this.db.query.posts.findFirst({
      where: eq(posts.slug, slug),
    });

    if (slugExists) {
      throw new BadRequestException({ message: 'Slug already exists' });
    }

    const imageUrl = await this.cloudinaryService.uploadFile(image);

    const newPost = await this.db
      .insert(posts)
      .values({
        title,
        slug,
        image: imageUrl.secure_url,
        content,
        excerpt,
        categoryId,
        status,
        authorId,
      })
      .returning();

    if (!newPost) {
      throw new BadRequestException({ message: 'Failed to create post' });
    }

    return {
      message: 'Post created successfully',
      post: newPost,
    };
  }

  async search(query: string) {
    const searchResults = await this.db.query.posts.findMany({
      where: or(
        ilike(posts.title, `%${query}%`),
        ilike(posts.content, `%${query}%`),
        ilike(posts.excerpt, `%${query}%`),
      ),
      with: {
        category: {
          columns: { name: true, slug: true },
        },
        author: {
          columns: { firstName: true, lastName: true },
        },
      },
    });
    return searchResults;
  }

  async toggleLike(postId: number, userId: number) {
    const post = await this.db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });
    if (!post) throw new NotFoundException('Post not found');

    const existingLike = await this.db.query.postLikes.findFirst({
      where: and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)),
    });

    if (existingLike) {
      await this.db
        .delete(postLikes)
        .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
      return { message: 'Post unliked', liked: false };
    } else {
      await this.db.insert(postLikes).values({ postId, userId });
      return { message: 'Post liked', liked: true };
    }
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
        comments: true,
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
        comments: true,
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

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    image?: Express.Multer.File,
  ) {
    const post = await this.db.query.posts.findFirst({
      where: eq(posts.id, id),
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    const updateData: Partial<typeof posts.$inferInsert> = { ...updatePostDto };

    if (image) {
      const uploadResult = await this.cloudinaryService.uploadFile(image);
      updateData.image = uploadResult.secure_url;

      if (post.image) {
        try {
          await this.cloudinaryService.deleteFile(post.image);
        } catch (error) {
          console.error('Failed to delete old image from Cloudinary:', error);
        }
      }
    }

    // 3. Perform Update
    const [updatedPost] = await this.db
      .update(posts)
      .set(updateData)
      .where(eq(posts.id, id))
      .returning();

    return {
      message: 'Post updated successfully',
      post: updatedPost,
    };
  }

  async remove(id: number) {
    const [deletedPost] = await this.db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning({ image: posts.image });

    if (!deletedPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    if (deletedPost.image) {
      await this.cloudinaryService.deleteFile(deletedPost.image);
    }

    return { message: `Post with ID ${id} deleted successfully` };
  }
}
