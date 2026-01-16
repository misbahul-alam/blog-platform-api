import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { DRIZZLE } from '../../database/database.module';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let dbMock: any;

  beforeEach(async () => {
    dbMock = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      query: {
        categories: {
          findMany: jest.fn(),
        },
      },
      then: undefined,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesService, { provide: DRIZZLE, useValue: dbMock }],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      };
      dbMock.select.mockReturnValue(mockSelectChain);

      const newCat = { id: 1, name: 'Test', slug: 'test' };
      dbMock.returning.mockResolvedValueOnce([newCat]);

      const result = await service.create({ name: 'Test', slug: 'test' });
      expect(result.category).toEqual(newCat);
    });

    it('should throw ConflictException if slug exists', async () => {
      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([{ id: 1 }]),
      };
      dbMock.select.mockReturnValue(mockSelectChain);

      await expect(
        service.create({ name: 'Test', slug: 'test' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const cats = [{ id: 1, name: 'Test' }];
      dbMock.query.categories.findMany.mockResolvedValue(cats);
      expect(await service.findAll()).toEqual(cats);
    });
  });

  describe('findOne', () => {
    it('should return a category', async () => {
      const cat = { id: 1 };
      const mockChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([cat]),
      };
      dbMock.select.mockReturnValue(mockChain);

      const res = await service.findOne(1);
      expect(res).toEqual(cat);
    });
  });
});
