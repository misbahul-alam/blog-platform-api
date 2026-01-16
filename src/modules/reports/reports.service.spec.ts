import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { ReportType } from './dto/create-report.dto';
import { ReportStatus } from './dto/update-report.dto';
import { DRIZZLE } from '../../database/database.module';
import { NotFoundException } from '@nestjs/common';

describe('ReportsService', () => {
  let service: ReportsService;
  let dbMock: any;

  beforeEach(async () => {
    dbMock = {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      query: {
        reports: {
          findMany: jest.fn(),
          findFirst: jest.fn(),
        },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportsService, { provide: DRIZZLE, useValue: dbMock }],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create report', async () => {
      const report = { id: 1 };
      dbMock.returning.mockResolvedValue([report]);
      const res = await service.create(
        { reason: 'Bad Content', type: ReportType.POST, targetId: 1 },
        1,
      );
      expect(res.report).toEqual(report);
    });
  });

  describe('findAll', () => {
    it('should return reports', async () => {
      const reports = [{ id: 1 }];
      dbMock.query.reports.findMany.mockResolvedValue(reports);
      expect(await service.findAll()).toEqual(reports);
    });
  });

  describe('update', () => {
    it('should update report status', async () => {
      dbMock.returning.mockResolvedValue([
        { id: 1, status: ReportStatus.RESOLVED },
      ]);
      const res = await service.update(1, { status: ReportStatus.RESOLVED });
      expect(res.report.status).toBe(ReportStatus.RESOLVED);
    });
  });
});
