import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Create a new tag (Admin only)',
    description: 'Creates a new unique tag. Restricted to Administrators.',
  })
  @ApiResponse({ status: 201, description: 'Tag created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 409, description: 'Conflict (Slug already exists)' })
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all tags',
    description: 'Retrieves all available tags, optionally paginated.',
  })
  @ApiResponse({ status: 200, description: 'Return all tags' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.tagsService.findAll(paginationDto);
  }

  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get tag by slug',
    description: 'Retrieves tag details by its URL-friendly slug.',
  })
  @ApiResponse({ status: 200, description: 'Return the tag' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  findOneBySlug(@Param('slug') slug: string) {
    return this.tagsService.findOneBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get tag by ID',
    description: 'Retrieves tag details by its numeric ID.',
  })
  @ApiResponse({ status: 200, description: 'Return the tag' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Update a tag (Admin only)',
    description:
      'Updates tag details (e.g. name, slug). Restricted to Administrators.',
  })
  @ApiResponse({ status: 200, description: 'Tag updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @ApiResponse({ status: 409, description: 'Conflict (Slug already exists)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Delete a tag (Admin only)',
    description: 'Permanently deletes a tag. Admin access required.',
  })
  @ApiResponse({ status: 200, description: 'Tag deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.remove(id);
  }
}
