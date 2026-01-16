import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Inquiry' })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({ example: 'Hello, I have a question...' })
  @IsNotEmpty()
  @MinLength(10)
  message: string;
}
