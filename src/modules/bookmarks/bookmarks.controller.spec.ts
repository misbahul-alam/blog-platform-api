import { Test, TestingModule } from '@nestjs/testing';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';

describe('BookmarksController', () => {
  let controller: BookmarksController;

  const mockBookmarksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookmarksController],
      providers: [
        {
          provide: BookmarksService,
          useValue: mockBookmarksService,
        },
      ],
    }).compile();

    controller = module.get<BookmarksController>(BookmarksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});