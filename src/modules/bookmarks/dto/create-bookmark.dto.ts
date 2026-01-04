import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({ example: 1, description: 'ID of the post to bookmark' })
  @IsNotEmpty()
  @IsInt()
  postId: number;
}
