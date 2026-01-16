import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { NewslettersService } from './newsletters.service';
import { SubscribeDto } from './dto/subscribe.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Newsletters')
@Controller('newsletters')
export class NewslettersController {
  constructor(private readonly newslettersService: NewslettersService) {}

  @Post('subscribe')
  @ApiOperation({
    summary: 'Subscribe to newsletter',
    description: 'Subscribes an email address to the newsletter.',
  })
  @ApiResponse({ status: 201, description: 'Subscribed successfully' })
  @ApiResponse({ status: 409, description: 'Email already subscribed' })
  subscribe(@Body() subscribeDto: SubscribeDto) {
    return this.newslettersService.subscribe(subscribeDto);
  }

  @Post('unsubscribe')
  @ApiOperation({
    summary: 'Unsubscribe from newsletter',
    description: 'Unsubscribes an email address from the newsletter.',
  })
  @ApiResponse({ status: 200, description: 'Unsubscribed successfully' })
  @ApiResponse({ status: 404, description: 'Subscriber not found' })
  unsubscribe(@Body() subscribeDto: SubscribeDto) {
    return this.newslettersService.unsubscribe(subscribeDto.email);
  }

  @Get('subscribers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Get all active subscribers (Admin only)',
    description: 'Retrieves a list of all active newsletter subscribers.',
  })
  @ApiResponse({ status: 200, description: 'Return all subscribers' })
  getAllSubscribers() {
    return this.newslettersService.getAllSubscribers();
  }
}
