import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DRIZZLE } from 'src/database/database.module';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let dbMock: any;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    role: 'reader',
    firstName: 'Test',
    lastName: 'User',
  };

  beforeEach(async () => {
    dbMock = {
      query: {
        users: {
          findFirst: jest.fn(),
          findMany: jest.fn(),
        },
      },
      delete: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn(),
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DRIZZLE,
          useValue: dbMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(mockUser);
      const result = await service.getProfile(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserById', () => {
    it('should return user if found', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(mockUser);
      const result = await service.getUserById(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if not found', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(null);
      await expect(service.getUserById(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete user if exists', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(mockUser);
      const result = await service.deleteUser(1);
      expect(dbMock.delete).toHaveBeenCalled();
      expect(result).toHaveProperty('message', 'User deleted successfully');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(null);
      await expect(service.deleteUser(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('should update and return user', async () => {
      const updatedUser = { ...mockUser, firstName: 'Updated' };
      dbMock.returning.mockResolvedValue([updatedUser]);

      const dto = { firstName: 'Updated' };
      const result = await service.updateProfile(1, dto);

      expect(dbMock.update).toHaveBeenCalled();
      expect(result.user).toEqual(updatedUser);
    });
  });
});
