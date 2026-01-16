import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { DRIZZLE } from 'src/database/database.module';
import { NotFoundException } from '@nestjs/common';

describe('CommentsService', () => {
  let service: CommentsService;
  let dbMock: any;

  const mockComment = {
    id: 1,
    content: 'Test Comment',
    postId: 1,
    userId: 1,
    parentId: null,
  };

  beforeEach(async () => {
    dbMock = {
      query: {
        comments: {
          findFirst: jest.fn(),
          findMany: jest.fn(),
        },
        posts: {
          findFirst: jest.fn(),
        },
        commentLikes: {
          findFirst: jest.fn(),
        },
      },
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn(),
      delete: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: DRIZZLE,
          useValue: dbMock,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  describe('create', () => {
    it('should create comment if post exists', async () => {
      dbMock.query.posts.findFirst.mockResolvedValue({ id: 1 });
      dbMock.returning.mockResolvedValue([mockComment]);

      const dto = { content: 'Test', postId: 1 };
      const result = await service.create(dto, 1);

      expect(dbMock.insert).toHaveBeenCalled();
      expect(result.data).toEqual(mockComment);
    });

    it('should throw NotFoundException if post not found', async () => {
      dbMock.query.posts.findFirst.mockResolvedValue(null);
      const dto = { content: 'Test', postId: 99 };
      await expect(service.create(dto, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if parent comment not found', async () => {
      dbMock.query.posts.findFirst.mockResolvedValue({ id: 1 });
      dbMock.query.comments.findFirst.mockResolvedValue(null); // Parent checks

      const dto: any = { content: 'Test', postId: 1, parentId: 99 };
      await expect(service.create(dto, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleLike', () => {
    it('should like comment if not liked', async () => {
      dbMock.query.comments.findFirst.mockResolvedValue(mockComment);
      dbMock.query.commentLikes.findFirst.mockResolvedValue(null);

      const result = await service.toggleLike(1, 1);

      expect(dbMock.insert).toHaveBeenCalled();
      expect(result.liked).toBe(true);
    });

    it('should unlike comment if liked', async () => {
      dbMock.query.comments.findFirst.mockResolvedValue(mockComment);
      dbMock.query.commentLikes.findFirst.mockResolvedValue({
        userId: 1,
        commentId: 1,
      });

      const result = await service.toggleLike(1, 1);

      expect(dbMock.delete).toHaveBeenCalled();
      expect(result.liked).toBe(false);
    });
  });
});
