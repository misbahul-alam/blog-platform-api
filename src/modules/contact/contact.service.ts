import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContactService {
  constructor(
    private readonly mailService: MailService,
    private readonly config: ConfigService,
  ) {}

  async create(createContactDto: CreateContactDto) {
    const { name, email, subject, message } = createContactDto;

    const adminEmail = this.config.get<string>(
      'SMTP_User',
      'admin@example.com',
    );

    // Email to Admin
    const html = `
      <h3>New Contact Form Submission</h3>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    await this.mailService.sendMail(adminEmail, `Contact: ${subject}`, html);

    return { message: 'Message sent successfully' };
  }
}
