import { Controller, Post, Body } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiOperation({
    summary: 'Send a contact message',
    description:
      'Submits a contact form message which is effectively emailed to the site administrator.',
  })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }
}
