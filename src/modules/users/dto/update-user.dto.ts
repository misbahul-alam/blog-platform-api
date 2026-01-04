import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'John', description: 'First name', required: false })
  @IsString({ message: 'First name must be a string' })
  @IsOptional({ message: 'First name is optional' })
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
  @IsString({ message: 'Last name must be a string' })
  @IsOptional({ message: 'Last name is optional' })
  lastName?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address',
    required: false,
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsOptional({ message: 'Email is optional' })
  email?: string;

  @ApiProperty({
    example: 'I am a software engineer...',
    description: 'User bio',
    required: false,
  })
  @IsString({ message: 'Bio must be a string' })
  @IsOptional({ message: 'Bio is optional' })
  bio?: string;
}
