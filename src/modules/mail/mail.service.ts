import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    const from =
      this.configService.get<string>('SMTP_FROM') ||
      '"No Reply" <noreply@example.com>';

    await this.transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string) {
    // Assuming the frontend URL is also in env or hardcoded for now
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    const subject = 'Password Reset Request';
    const html = `
      <p>You requested a password reset</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await this.sendMail(to, subject, html);
  }

  async sendVerificationEmail(to: string, token: string) {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const verificationLink = `${frontendUrl}/verify-email?token=${token}`;

    const subject = 'Verify your email';
    const html = `
      <p>Thank you for registering!</p>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationLink}">${verificationLink}</a>
    `;

    await this.sendMail(to, subject, html);
  }
}
