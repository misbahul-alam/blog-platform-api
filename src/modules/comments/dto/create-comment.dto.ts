import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'Content should not be empty' })
  @IsNumber({}, { message: 'Post ID must be a number' })
  postId: number;

  @IsNotEmpty({ message: 'Content should not be empty' })
  @IsString({ message: 'Content must be a string' })
  content: string;
}
