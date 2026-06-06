import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

  async sendContactNotification(name: string, email: string, subject: string, body: string) {
    try {
      await this.mailerService.sendMail({
        to: process.env.SMTP_FROM || 'admin@example.com',
        subject: `[Portfolio] New message from ${name}: ${subject}`,
        text: `From: ${name} (${email})\n\n${body}`,
        html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Subject:</strong> ${subject}</p><hr><p>${body}</p>`,
      });
      this.logger.log(`Contact email sent from ${name}`);
    } catch (error) {
      this.logger.error('Failed to send contact email', error);
    }
  }
}
