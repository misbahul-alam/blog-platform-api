import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthUser } from 'src/common/types/auth-user.types';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Bookmarks')
@ApiBearerAuth('token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.admin, Role.author, Role.reader)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  @ApiOperation({
    summary: 'Bookmark a post',
    description: 'Saves a post to the authenticated user bookmarks.',
  })
  @ApiResponse({ status: 201, description: 'Post bookmarked successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Conflict (Already bookmarked)' })
  create(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @CurrentUser() user: AuthUser,
  ) {
    const userId = user.id;
    return this.bookmarksService.create(createBookmarkDto, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all bookmarks for current user',
    description:
      'Retrieves a paginated list of posts bookmarked by the current user.',
  })
  @ApiResponse({ status: 200, description: 'Return all bookmarks' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @CurrentUser() user: AuthUser,
    @Query() paginationDto: PaginationDto,
  ) {
    const userId = user.id;
    return this.bookmarksService.findAll(userId, paginationDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remove a bookmark',
    description: 'Deletes a specific bookmark by its ID.',
  })
  @ApiResponse({ status: 200, description: 'Bookmark removed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Bookmark not found' })
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    const userId = user.id;
    return this.bookmarksService.remove(id, userId);
  }
}
