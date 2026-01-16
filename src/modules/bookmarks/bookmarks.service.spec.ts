import { Test, TestingModule } from '@nestjs/testing';
import { BookmarksService } from './bookmarks.service';
import { DRIZZLE } from 'src/database/database.module';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('BookmarksService', () => {
  let service: BookmarksService;
  let dbMock: any;

  beforeEach(async () => {
    dbMock = {
      query: {
        posts: { findFirst: jest.fn() },
        bookmarks: { findFirst: jest.fn(), findMany: jest.fn() },
      },
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn(),
      delete: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarksService,
        { provide: DRIZZLE, useValue: dbMock },
      ],
    }).compile();

    service = module.get<BookmarksService>(BookmarksService);
  });

  describe('create', () => {
    it('should create bookmark if post exists and not bookmarked', async () => {
      dbMock.query.posts.findFirst.mockResolvedValue({ id: 1 });
      dbMock.query.bookmarks.findFirst.mockResolvedValue(null);
      dbMock.returning.mockResolvedValue([{ id: 1, postId: 1, userId: 1 }]);

      const result = await service.create({ postId: 1 }, 1);
      expect(result).toBeDefined();
    });

    it('should throw NotFound if post missing', async () => {
      dbMock.query.posts.findFirst.mockResolvedValue(null);
      await expect(service.create({ postId: 1 }, 1)).rejects.toThrow(NotFoundException);
    });
    
     it('should throw Conflict if already bookmarked', async () => {
      dbMock.query.posts.findFirst.mockResolvedValue({ id: 1 });
      dbMock.query.bookmarks.findFirst.mockResolvedValue({ id: 1 });
      await expect(service.create({ postId: 1 }, 1)).rejects.toThrow(ConflictException);
    });
  });
});