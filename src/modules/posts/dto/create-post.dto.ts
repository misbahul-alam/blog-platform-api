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
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'Slug is required' })
  @IsString({ message: 'Slug must be a string' })
  slug: string;

  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  content: string;

  @IsString({ message: 'Excerpt must be a string' })
  excerpt?: string;

  @Transform(({ value }) => Number(value))
  @IsNotEmpty({ message: 'Category ID is required' })
  @IsNumber({}, { message: 'Category ID must be a number' })
  categoryId: number;

  @IsOptional()
  @IsEnum(PostStatus, {
    message:
      'Status must be one of the following values: draft, published, archived',
  })
  status: PostStatus = PostStatus.draft;
}
