import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 1, description: 'ID of the post to comment on' })
  @IsNotEmpty({ message: 'Content should not be empty' })
  @IsNumber({}, { message: 'Post ID must be a number' })
  postId: number;

  @ApiProperty({
    example: 1,
    description: 'ID of the parent comment (optional)',
    required: false,
  })
  @IsNumber({}, { message: 'Parent ID must be a number' })
  @IsOptional()
  parentId?: number;

  @ApiProperty({
    example: 'Great post!',
    description: 'Content of the comment',
  })
  @IsNotEmpty({ message: 'Content should not be empty' })
  @IsString({ message: 'Content must be a string' })
  content: string;
}
