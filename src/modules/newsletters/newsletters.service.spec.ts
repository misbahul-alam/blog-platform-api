import { Test, TestingModule } from '@nestjs/testing';
import { NewslettersService } from './newsletters.service';
import { DRIZZLE } from '../../database/database.module';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('NewslettersService', () => {
  let service: NewslettersService;
  let dbMock: any;

  beforeEach(async () => {
    dbMock = {
      query: {
        newsletters: {
          findFirst: jest.fn(),
          findMany: jest.fn(),
        },
      },
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [NewslettersService, { provide: DRIZZLE, useValue: dbMock }],
    }).compile();

    service = module.get<NewslettersService>(NewslettersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('subscribe', () => {
    it('should subscribe new email', async () => {
      dbMock.query.newsletters.findFirst.mockResolvedValue(null);

      const chain = { ...dbMock };
      chain.values.mockResolvedValue(true);
      dbMock.insert.mockReturnValue(chain);

      await service.subscribe({ email: 'test@test.com' });
      expect(dbMock.insert).toHaveBeenCalled();
    });
  });
});
