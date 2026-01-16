import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { DRIZZLE } from 'src/database/database.module';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;
  let cloudinaryService: CloudinaryService;
  let dbMock: any;

  const mockPost = {
    id: 1,
    title: 'Test Post',
    slug: 'test-post',
    image: 'http://image.url/test.jpg',
    content: 'Content',
    authorId: 1,
    categoryId: 1,
    status: 'published',
  };

  const mockImage = {
    buffer: Buffer.from('test'),
  } as Express.Multer.File;

  beforeEach(async () => {
    dbMock = {
      query: {
        posts: {
          findFirst: jest.fn(),
          findMany: jest.fn(),
        },
        categories: {
          findFirst: jest.fn(),
        },
        postLikes: {
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
        PostsService,
        {
          provide: DRIZZLE,
          useValue: dbMock,
        },
        {
          provide: CloudinaryService,
          useValue: {
            uploadFile: jest
              .fn()
              .mockResolvedValue({ secure_url: 'http://image.url/test.jpg' }),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  describe('create', () => {
    it('should create a post successfully', async () => {
      // Mock category exists
      dbMock.query.categories.findFirst.mockResolvedValue({ id: 1 });
      // Mock slug unique
      dbMock.query.posts.findFirst.mockResolvedValue(null);
      // Mock insert return
      dbMock.returning.mockResolvedValue([mockPost]);

      const dto: any = {
        title: 'Test Post',
        slug: 'test-post',
        content: 'Content',
        categoryId: 1,
        status: 'published',
      };

      const result = await service.create(dto, 1, mockImage);

      expect(cloudinaryService.uploadFile).toHaveBeenCalled();
      expect(dbMock.insert).toHaveBeenCalled();
      expect(result.post).toEqual([mockPost]);
    });

    it('should throw BadRequestException if category invalid', async () => {
      dbMock.query.categories.findFirst.mockResolvedValue(null);
      const dto: any = { categoryId: 999 };
      await expect(service.create(dto, 1, mockImage)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if slug exists', async () => {
      dbMock.query.categories.findFirst.mockResolvedValue({ id: 1 });
      dbMock.query.posts.findFirst.mockResolvedValue(mockPost);

      const dto: any = { categoryId: 1, slug: 'test-post' };
      await expect(service.create(dto, 1, mockImage)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('search', () => {
    it('should return search results', async () => {
      dbMock.query.posts.findMany.mockResolvedValue([mockPost]);

      const result = await service.search('query');
      expect(result).toEqual([mockPost]);
      expect(dbMock.query.posts.findMany).toHaveBeenCalled();
    });
  });

  describe('toggleLike', () => {
    it('should like a post if not liked yet', async () => {
      dbMock.query.posts.findFirst.mockResolvedValue(mockPost);
      dbMock.query.postLikes.findFirst.mockResolvedValue(null);

      // We need to return something from insert for this to succeed if the service expects it
      // but toggleLike often returns a message. Let's assume standard behavior.

      const result = await service.toggleLike(1, 1);

      // Since it's void or message, checks interactions
      expect(dbMock.insert).toHaveBeenCalled();
      expect(result).toHaveProperty('message', 'Post liked');
    });

    it('should unlike a post if already liked', async () => {
      dbMock.query.posts.findFirst.mockResolvedValue(mockPost);
      dbMock.query.postLikes.findFirst.mockResolvedValue({
        userId: 1,
        postId: 1,
      });

      const result = await service.toggleLike(1, 1);

      expect(dbMock.delete).toHaveBeenCalled();
      expect(result).toHaveProperty('message', 'Post unliked');
    });

    it('should throw NotFoundException if post not found', async () => {
      dbMock.query.posts.findFirst.mockResolvedValue(null);

      await expect(service.toggleLike(1, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
