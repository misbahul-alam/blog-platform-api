import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'First name must be a string' })
  @IsOptional({ message: 'First name is optional' })
  firstName?: string;

  @IsString({ message: 'Last name must be a string' })
  @IsOptional({ message: 'Last name is optional' })
  lastName?: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsOptional({ message: 'Email is optional' })
  email?: string;

  @IsString({ message: 'Bio must be a string' })
  @IsOptional({ message: 'Bio is optional' })
  bio?: string;
}
