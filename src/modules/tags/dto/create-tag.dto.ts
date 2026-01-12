import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ example: 'Technology', description: 'Name of the tag' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    example: 'technology',
    description: 'Slug for the tag URL',
  })
  @Transform(({ value }) => value?.trim().toLowerCase().replace(/\s+/g, '-'))
  @IsNotEmpty({ message: 'Slug is required' })
  @IsString({ message: 'Slug must be a string' })
  slug: string;
}
