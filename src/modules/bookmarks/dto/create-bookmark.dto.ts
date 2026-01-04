import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateBookmarkDto {
  @IsNotEmpty()
  @IsInt()
  postId: number;
}
