import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthUser } from 'src/common/types/auth-user.types';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth('token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.admin, Role.author, Role.reader)
  @Get('me')
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      'Retrieves the profile information of the currently authenticated user.',
  })
  @ApiResponse({ status: 200, description: 'Return current user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@CurrentUser() user: AuthUser) {
    return this.usersService.getProfile(user.id);
  }

  @Patch('me')
  @Roles(Role.admin, Role.author, Role.reader)
  @ApiOperation({
    summary: 'Update current user profile',
    description: "Updates the authenticated user's profile details.",
  })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateProfile(
    @CurrentUser() user: AuthUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(user.id, updateUserDto);
  }

  @Get('admin/stats')
  @Roles(Role.admin)
  @ApiOperation({
    summary: 'Get admin stats',
    description:
      'Retrieves system-wide statistics for administrators (e.g., total users, posts).',
  })
  @ApiResponse({ status: 200, description: 'Return stats' })
  getAdminStats() {
    return this.usersService.getAdminStats();
  }

  @Get('public/:id')
  @Roles(Role.admin, Role.author, Role.reader)
  @ApiOperation({
    summary: 'Get public profile',
    description: 'Retrieves the public profile of a user by their unique ID.',
  })
  @ApiResponse({ status: 200, description: 'Return user profile' })
  getPublicProfile(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getPublicProfile(id);
  }

  @Get()
  @Roles(Role.admin)
  @ApiOperation({
    summary: 'Get all users (Admin only)',
    description:
      'Retrieves a list of all registered users. Restricted to Admins.',
  })
  @ApiResponse({ status: 200, description: 'Return all users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return the user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }

  @Delete(':id')
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
