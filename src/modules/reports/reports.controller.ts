import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
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
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthUser } from 'src/common/types/auth-user.types';

@ApiTags('Reports')
@ApiBearerAuth('token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @Roles(Role.admin, Role.author, Role.reader)
  @ApiOperation({
    summary: 'Submit a report',
    description:
      'Allows users to report inappropriate content (posts, comments, or users).',
  })
  @ApiResponse({ status: 201, description: 'Report submitted successfully' })
  create(
    @Body() createReportDto: CreateReportDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.reportsService.create(createReportDto, user.id);
  }

  @Get()
  @Roles(Role.admin)
  @ApiOperation({
    summary: 'Get all reports (Admin only)',
    description: 'Retrieves all content reports for moderation review.',
  })
  @ApiResponse({ status: 200, description: 'Return all reports' })
  findAll() {
    return this.reportsService.findAll();
  }

  @Get(':id')
  @Roles(Role.admin)
  @ApiOperation({
    summary: 'Get a report by ID (Admin only)',
    description: 'Retrieves details of a specific report.',
  })
  @ApiResponse({ status: 200, description: 'Return the report' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.admin)
  @ApiOperation({
    summary: 'Update report status (Admin only)',
    description:
      'Updates the status of a report (e.g. from PENDING to RESOLVED).',
  })
  @ApiResponse({ status: 200, description: 'Report updated successfully' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    return this.reportsService.update(id, updateReportDto);
  }

  @Delete(':id')
  @Roles(Role.admin)
  @ApiOperation({
    summary: 'Delete a report (Admin only)',
    description: 'Permanently deletes a report record.',
  })
  @ApiResponse({ status: 200, description: 'Report deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.remove(id);
  }
}
