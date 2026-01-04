import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Technology', description: 'Name of the category' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    example: 'technology',
    description: 'Slug for the category URL',
  })
  @Transform(({ value }) => value?.trim().toLowerCase().replace(/\s+/g, '-'))
  @IsNotEmpty({ message: 'Slug is required' })
  @IsString({ message: 'Slug must be a string' })
  slug: string;

  @ApiProperty({
    example: 1,
    description: 'ID of the parent category',
    required: false,
  })
  @IsOptional({ message: 'Parent ID is optional' })
  parentId?: number;
}
