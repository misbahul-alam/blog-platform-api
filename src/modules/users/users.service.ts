import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DRIZZLE } from 'src/database/database.module';
import { users, posts, comments } from 'src/database/schema/schema';
import type { DrizzleDB } from 'src/database/types/drizzle';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}
  async getProfile(userId: number) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { id: true, email: true, role: true, createdAt: true },
    });
    return user;
  }

  async getAllUsers() {
    const allUsers = await this.db.query.users.findMany({
      columns: { id: true, email: true, role: true, createdAt: true },
    });
    return allUsers;
  }

  async getUserById(id: number) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, id),
      columns: { id: true, email: true, role: true, createdAt: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async deleteUser(id: number) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.db.delete(users).where(eq(users.id, id));
    return { message: 'User deleted successfully' };
  }

  async updateProfile(id: number, updateUserDto: UpdateUserDto) {
    const { firstName, lastName, email, bio } = updateUserDto;

    const [updatedUser] = await this.db
      .update(users)
      .set({
        firstName: firstName,
        lastName: lastName,
        email: email,
        bio: bio,
      })
      .where(eq(users.id, id))
      .returning();

    return { message: 'Profile updated successfully', user: updatedUser };
  }

  async getPublicProfile(id: number) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        role: true,
        createdAt: true,
      },
      with: {
        posts: {
          limit: 5,
          where: eq(posts.status, 'published'),
          orderBy: (posts, { desc }) => [desc(posts.createdAt)],
          columns: { id: true, title: true, slug: true, createdAt: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async getAdminStats() {
    const [usersCount, postsCount, commentsCount] = await Promise.all([
      this.db.select({ count: sql<number>`count(*)` }).from(users),
      this.db.select({ count: sql<number>`count(*)` }).from(posts),
      this.db.select({ count: sql<number>`count(*)` }).from(comments),
    ]);

    return {
      users: Number(usersCount[0].count),
      posts: Number(postsCount[0].count),
      comments: Number(commentsCount[0].count),
    };
  }
}
