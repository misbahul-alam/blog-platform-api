import {
  Body,
  Controller,
  HttpCode,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/password.dto';
import { VerifyEmailDto, ResendVerificationDto } from './dto/verify-email.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthUser } from 'src/common/types/auth-user.types';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('verify-email')
  @ApiOperation({
    summary: 'Verify email address',
    description: 'Verifies user account using the token sent via email.',
  })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto.token);
  }

  @Post('resend-verification')
  @ApiOperation({
    summary: 'Resend verification email',
    description:
      'Resends the verification email if the user is not yet verified.',
  })
  @ApiResponse({ status: 200, description: 'Verification email sent' })
  resendVerification(@Body() resendVerificationDto: ResendVerificationDto) {
    return this.authService.resendVerificationEmail(
      resendVerificationDto.email,
    );
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Change password',
    description:
      'Allows logged-in users to change their password provided they know the old one.',
  })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  changePassword(
    @CurrentUser() user: AuthUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.id, changePasswordDto);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Request password reset',
    description:
      'Initiates password recovery process. Sends an email with a reset token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reset email sent if account exists',
  })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid token' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
