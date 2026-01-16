import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
    required: false,
    default: 10,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @IsPositive()
  limit: number = 10;

  @ApiProperty({
    example: 1,
    description: 'Page number',
    required: false,
    default: 1,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @IsPositive()
  page: number = 1;
}
