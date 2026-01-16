import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from './tags.service';
import { DRIZZLE } from '../../database/database.module';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('TagsService', () => {
  let service: TagsService;
  let dbMock: any;

  beforeEach(async () => {
    dbMock = {
      query: {
        tags: {
          findFirst: jest.fn(),
          findMany: jest.fn(),
        },
      },
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      // Adding common chain properties
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [TagsService, { provide: DRIZZLE, useValue: dbMock }],
    }).compile();

    service = module.get<TagsService>(TagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create tag', async () => {
      dbMock.query.tags.findFirst.mockResolvedValue(null);
      const tag = { id: 1, name: 'T', slug: 't' };
      dbMock.returning.mockResolvedValue([tag]);

      const res = await service.create({ name: 'T', slug: 't' });
      expect(res.data).toEqual(tag);
    });
  });
});
