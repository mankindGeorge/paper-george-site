import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  async sendContactNotification(name: string, email: string, subject: string, body: string) {
    try {
      const safeName = this.escapeHtml(name);
      const safeEmail = this.escapeHtml(email);
      const safeSubject = this.escapeHtml(subject);
      const safeBody = this.escapeHtml(body);
      await this.mailerService.sendMail({
        to: process.env.SMTP_FROM || 'admin@example.com',
        subject: `[Portfolio] New message from ${name}: ${subject}`,
        text: `From: ${name} (${email})\n\n${body}`,
        html: `<p><strong>From:</strong> ${safeName} (${safeEmail})</p><p><strong>Subject:</strong> ${safeSubject}</p><hr><p>${safeBody}</p>`,
      });
      this.logger.log(`Contact email sent from ${name}`);
    } catch (error) {
      this.logger.error('Failed to send contact email', error);
    }
  }
}
