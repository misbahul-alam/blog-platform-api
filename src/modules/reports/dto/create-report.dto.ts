import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export enum ReportType {
  POST = 'post',
  COMMENT = 'comment',
  USER = 'user',
}

export class CreateReportDto {
  @ApiProperty({ enum: ReportType, example: 'post' })
  @IsNotEmpty()
  @IsEnum(ReportType)
  type: ReportType;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  targetId: number;

  @ApiProperty({ example: 'Inappropriate content' })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  reason: string;
}
