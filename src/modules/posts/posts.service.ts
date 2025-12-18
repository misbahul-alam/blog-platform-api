import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DRIZZLE } from 'src/database/database.module';
import type { DrizzleDB } from 'src/database/types/drizzle';

@Injectable()
export class PostsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}
  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

  async findAll() {
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
            tag: true,
          },
        },
      },
    });
    return posts;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
