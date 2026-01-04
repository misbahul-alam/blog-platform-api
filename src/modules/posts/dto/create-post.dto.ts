import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PostStatus } from 'src/common/enums/post-status.enum';

export class CreatePostDto {
  @ApiProperty({
    example: 'My First Blog Post',
    description: 'Title of the post',
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiProperty({
    example: 'my-first-blog-post',
    description: 'Slug for the post URL',
  })
  @IsNotEmpty({ message: 'Slug is required' })
  @IsString({ message: 'Slug must be a string' })
  slug: string;

  @ApiProperty({
    example: 'This is the content...',
    description: 'Main content of the post',
  })
  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  content: string;

  @ApiProperty({
    example: 'Short summary...',
    description: 'Excerpt of the post',
    required: false,
  })
  @IsString({ message: 'Excerpt must be a string' })
  excerpt?: string;

  @ApiProperty({ example: 1, description: 'ID of the category' })
  @Transform(({ value }) => Number(value))
  @IsNotEmpty({ message: 'Category ID is required' })
  @IsNumber({}, { message: 'Category ID must be a number' })
  categoryId: number;

  @ApiProperty({
    enum: PostStatus,
    default: PostStatus.draft,
    description: 'Status of the post',
  })
  @IsOptional()
  @IsEnum(PostStatus, {
    message:
      'Status must be one of the following values: draft, published, archived',
  })
  status: PostStatus = PostStatus.draft;
}
