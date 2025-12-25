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

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.admin, Role.author, Role.reader)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  create(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @CurrentUser() user: AuthUser,
  ) {
    const userId = user.id;
    return this.bookmarksService.create(createBookmarkDto, userId);
  }

  @Get()
  findAll(
    @CurrentUser() user: AuthUser,
    @Query() paginationDto: PaginationDto,
  ) {
    const userId = user.id;
    return this.bookmarksService.findAll(userId, paginationDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    const userId = user.id;
    return this.bookmarksService.remove(id, userId);
  }
}
