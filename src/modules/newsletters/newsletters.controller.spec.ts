import { Test, TestingModule } from '@nestjs/testing';
import { NewslettersController } from './newsletters.controller';
import { NewslettersService } from './newsletters.service';

describe('NewslettersController', () => {
  let controller: NewslettersController;

  const mockService = {
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
    getAllSubscribers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewslettersController],
      providers: [{ provide: NewslettersService, useValue: mockService }],
    }).compile();

    controller = module.get<NewslettersController>(NewslettersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
