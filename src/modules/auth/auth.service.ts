import { LoginDto } from './dto/login.dto';
import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DRIZZLE } from 'src/database/database.module';
import type { DrizzleDB } from 'src/database/types/drizzle';
import { RegisterDto } from './dto/register.dto';
import { eq, and, gt } from 'drizzle-orm';
import { users } from 'src/database/schema/users.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CustomJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { Role } from 'src/common/enums/role.enum';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/password.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const payload: CustomJwtPayload = {
      sub: user.id.toString(),
      email: user.email,
      role: user.role as Role,
    };

    const token = this.jwtService.sign(payload);

    return {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: user.id,
        role: user.role,
      },
      access_token: token,
    };
  }

  async register(registerDto: RegisterDto) {
    const { firstName, lastName, email, password } = registerDto;

    const exiting = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (exiting)
      throw new ConflictException('User with this email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await this.db
      .insert(users)
      .values({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      })
      .returning();

    const payload: CustomJwtPayload = {
      sub: newUser.id.toString(),
      email: newUser.email,
      role: newUser.role as Role,
    };
    const token = this.jwtService.sign(payload);

    return {
      message: 'User registered successfully',
      token,
      user: { ...newUser, password: undefined },
    };
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (!user) throw new NotFoundException('User not found');

    const match = await bcrypt.compare(dto.oldPassword, user.password);
    if (!match) throw new UnauthorizedException('Invalid old password');

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, dto.email),
    });
    if (!user) throw new NotFoundException('User with this email not found');

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await this.db
      .update(users)
      .set({
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      })
      .where(eq(users.id, user.id));

    // In a real app, send email here.
    return {
      message: 'Password reset token generated (simulated email sent)',
      resetToken: token, // Returning for testing purposes
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.db.query.users.findFirst({
      where: and(
        eq(users.resetPasswordToken, dto.token),
        gt(users.resetPasswordExpires, new Date()),
      ),
    });

    if (!user) throw new BadRequestException('Invalid or expired token');

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.db
      .update(users)
      .set({
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      })
      .where(eq(users.id, user.id));

    return { message: 'Password has been reset successfully' };
  }
}
