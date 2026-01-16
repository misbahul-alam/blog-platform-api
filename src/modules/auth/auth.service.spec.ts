import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { DRIZZLE } from 'src/database/database.module';
import {
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

jest.mock('bcrypt');
jest.mock('crypto');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let mailService: MailService;
  let dbMock: any;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'Test',
    lastName: 'User',
    role: 'reader',
    verificationToken: 'validToken',
    resetPasswordToken: 'validResetToken',
    resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hour future
  };

  beforeEach(async () => {
    dbMock = {
      query: {
        users: {
          findFirst: jest.fn(),
        },
      },
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn(),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: DRIZZLE,
          useValue: dbMock,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockJwtToken'),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendVerificationEmail: jest.fn(),
            sendPasswordResetEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    mailService = module.get<MailService>(MailService);

    // Setup crypto mock
    (crypto.randomBytes as jest.Mock).mockReturnValue({
      toString: jest.fn().mockReturnValue('mockedToken'),
    });
  });

  describe('login', () => {
    it('should return token and user info on valid credentials', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login({
        email: 'test@example.com',
        password: 'password',
      });

      expect(result).toHaveProperty('access_token', 'mockJwtToken');
      expect(result.user).toHaveProperty('email', 'test@example.com');
      expect(jwtService.sign).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if user not found', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(null);

      await expect(
        service.login({ email: 'wrong@example.com', password: 'password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password incorrect', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'test@example.com', password: 'wrongpass' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      // Mock insert returning new user
      dbMock.returning.mockResolvedValue([mockUser]);

      const dto = {
        firstName: 'New',
        lastName: 'User',
        email: 'new@example.com',
        password: 'password',
        confirmPassword: 'password',
      };
      const result = await service.register(dto);

      expect(dbMock.insert).toHaveBeenCalled();
      expect(mailService.sendVerificationEmail).toHaveBeenCalled();
      expect(result).toHaveProperty('token');
    });

    it('should throw ConflictException if email exists', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(mockUser);

      const dto = {
        firstName: 'New',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password',
        confirmPassword: 'password',
      };
      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('verifyEmail', () => {
    it('should verify user with valid token', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(mockUser);
      dbMock.returning.mockResolvedValue([
        { ...mockUser, isVerified: true, verificationToken: null },
      ]);

      const result = await service.verifyEmail('validToken');

      expect(result.message).toBe('Email verified successfully');
      expect(dbMock.update).toHaveBeenCalled();
    });

    it('should throw BadRequestException if token invalid', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(null);

      await expect(service.verifyEmail('invalidToken')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('forgotPassword', () => {
    it('should generate token and send email if user exists', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(mockUser);
      dbMock.returning.mockResolvedValue([mockUser]);

      await service.forgotPassword({ email: 'test@example.com' });

      expect(dbMock.update).toHaveBeenCalled();
      expect(mailService.sendPasswordResetEmail).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(null);

      await expect(
        service.forgotPassword({ email: 'unknown@example.com' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
