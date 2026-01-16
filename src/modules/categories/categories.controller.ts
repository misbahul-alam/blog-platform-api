import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Create a new category (Admin only)',
    description: 'Creates a new post category. Restricted to Administrators.',
  })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 409, description: 'Conflict (Slug already exists)' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all categories',
    description: 'Retrieves a list of all available categories.',
  })
  @ApiResponse({ status: 200, description: 'Return all categories' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get category by slug',
    description: 'Retrieves category details using its unique slug.',
  })
  @ApiResponse({ status: 200, description: 'Return the category' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOneBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findOneBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get category by ID',
    description: 'Retrieves category details using its numeric ID.',
  })
  @ApiResponse({ status: 200, description: 'Return the category' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Update a category (Admin only)',
    description:
      'Updates category details (e.g. name, slug). Restricted to Administrators.',
  })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Delete a category (Admin only)',
    description: 'Deletes a category permanetly. Restricted to Administrators.',
  })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
