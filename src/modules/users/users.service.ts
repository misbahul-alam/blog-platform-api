import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from 'src/database/database.module';
import { users } from 'src/database/schema/users.schema';
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
}
