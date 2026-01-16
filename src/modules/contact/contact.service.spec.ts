import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';

describe('ContactService', () => {
  let service: ContactService;
  let mailService: MailService;

  const mockMailService = {
    sendMail: jest.fn().mockResolvedValue(true),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('admin@test.com'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        { provide: MailService, useValue: mockMailService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should send email and return success', async () => {
      const dto = {
        name: 'John',
        email: 'j@j.com',
        subject: 'Hi',
        message: 'Hello, I have a question about...',
      };
      const res = await service.create(dto);
      expect(mockMailService.sendMail).toHaveBeenCalledWith(
        'admin@test.com',
        'Contact: Hi',
        expect.stringContaining('Hello'),
      );
      expect(res.message).toBe('Message sent successfully');
    });
  });
});
