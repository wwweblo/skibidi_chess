import nodemailer from "nodemailer";

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // SMTP сервер
      port: Number(process.env.EMAIL_PORT) || 587, // Порт
      secure: process.env.EMAIL_SECURE === "true", // true для 465, false для других портов
      auth: {
        user: process.env.EMAIL_USER, // Логин
        pass: process.env.EMAIL_PASS, // Пароль
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string, html?: string) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM, // Адрес отправителя
        to,
        subject,
        text,
        html,
      });
      console.log("Email sent: ", info.messageId);
      return info;
    } catch (error) {
      console.error("Error sending email: ", error);
      throw error;
    }
  }
}

export default new EmailService();
