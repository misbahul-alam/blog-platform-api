import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateReportDto } from './create-report.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum ReportStatus {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
}

export class UpdateReportDto {
  @ApiProperty({ enum: ReportStatus, example: 'resolved' })
  @IsNotEmpty()
  @IsEnum(ReportStatus)
  status: ReportStatus;
}
