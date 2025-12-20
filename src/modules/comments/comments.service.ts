import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { DRIZZLE } from 'src/database/database.module';
import type { DrizzleDB } from 'src/database/types/drizzle';
import { comments, posts } from 'src/database/schema/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class CommentsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async create(createCommentDto: CreateCommentDto, userId: number) {
    const { content, postId } = createCommentDto;

    const post = await this.db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const [comment] = await this.db
      .insert(comments)
      .values({
        content,
        postId,
        userId,
      })
      .returning();

    return {
      message: 'Comment created successfully',
      data: comment,
    };
  }

  async findAll(postId: number) {
    const post = await this.db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const postComments = await this.db.query.comments.findMany({
      where: eq(comments.postId, postId),
      orderBy: (comments, { desc }) => desc(comments.createdAt),
    });

    return {
      message: 'Comments retrieved successfully',
      data: postComments,
    };
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, userId: number) {
    const comment = await this.db.query.comments.findFirst({
      where: eq(comments.id, id),
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this comment',
      );
    }

    const [updatedComment] = await this.db
      .update(comments)
      .set({ content: updateCommentDto.content })
      .where(eq(comments.id, id))
      .returning();

    return {
      message: 'Comment updated successfully',
      data: updatedComment,
    };
  }

  async remove(id: number, userId: number) {
    const comment = await this.db.query.comments.findFirst({
      where: eq(comments.id, id),
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to delete this comment',
      );
    }

    const [deletedComment] = await this.db
      .delete(comments)
      .where(eq(comments.id, id))
      .returning();

    return {
      message: 'Comment deleted successfully',
      data: deletedComment,
    };
  }
}
