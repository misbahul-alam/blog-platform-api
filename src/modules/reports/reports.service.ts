import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto, ReportType } from './dto/create-report.dto';
import { ReportStatus, UpdateReportDto } from './dto/update-report.dto';
import { DRIZZLE } from 'src/database/database.module';
import type { DrizzleDB } from 'src/database/types/drizzle';
import { reports, reportStatusEnum } from 'src/database/schema/reports.schema';
import { eq, desc } from 'drizzle-orm';

@Injectable()
export class ReportsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async create(createReportDto: CreateReportDto, reporterId: number) {
    const [report] = await this.db
      .insert(reports)
      .values({
        ...createReportDto,
        reporterId,
        type: createReportDto.type as 'post' | 'comment' | 'user', // simple cast as they match
      })
      .returning();

    return { message: 'Report submitted successfully', report };
  }

  async findAll() {
    return this.db.query.reports.findMany({
      orderBy: [desc(reports.createdAt)],
      with: {
        reporter: {
          columns: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const report = await this.db.query.reports.findFirst({
      where: eq(reports.id, id),
      with: {
        reporter: {
          columns: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  async update(id: number, updateReportDto: UpdateReportDto) {
    const [updatedReport] = await this.db
      .update(reports)
      .set({
        status: updateReportDto.status as 'pending' | 'resolved' | 'dismissed',
      })
      .where(eq(reports.id, id))
      .returning();

    if (!updatedReport) throw new NotFoundException('Report not found');

    return { message: 'Report status updated', report: updatedReport };
  }

  async remove(id: number) {
    const deleted = await this.db
      .delete(reports)
      .where(eq(reports.id, id))
      .returning();

    if (!deleted.length) throw new NotFoundException('Report not found');

    return { message: 'Report deleted successfully' };
  }
}
