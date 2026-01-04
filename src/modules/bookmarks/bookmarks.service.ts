import { bookmarks, posts } from './../../database/schema/schema';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DRIZZLE } from 'src/database/database.module';
import type { DrizzleDB } from 'src/database/types/drizzle';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class BookmarksService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}
  async create(dto: CreateBookmarkDto, userId: number) {
    const postId = dto.postId;

    const post = await this.db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingBookmark = await this.db.query.bookmarks.findFirst({
      where: and(eq(bookmarks.postId, postId), eq(bookmarks.userId, userId)),
    });

    if (existingBookmark) {
      throw new ConflictException('Bookmark already exists');
    }

    const [bookmark] = await this.db
      .insert(bookmarks)
      .values({
        postId: postId,
        userId: userId,
      })
      .returning();

    return bookmark;
  }

  async findAll(userId: number, paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const bookmarkList = await this.db.query.bookmarks.findMany({
      where: eq(bookmarks.userId, userId),
      with: {
        post: true,
      },
      limit,
      offset: (page - 1) * limit,
    });

    return {
      data: bookmarkList,
      page,
      limit,
    };
  }

  async remove(id: number, userId: number) {
    const deletedCount = await this.db
      .delete(bookmarks)
      .where(and(eq(bookmarks.id, id), eq(bookmarks.userId, userId)))
      .returning();

    if (deletedCount.length === 0) {
      throw new NotFoundException('Bookmark not found!');
    }
    return { message: 'Bookmark deleted successfully' };
  }
}
