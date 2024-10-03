import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string; // HTML content for the email
}

class EmailSender {
  private transporter;

  constructor(private user: string, private pass: string) {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: this.user,
        pass: this.pass,
      },
    });
  }

  async sendEmailWithTemplate(options: EmailOptions): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: "noreply@tieup.net", // sender address
        to: options.to, // list of receivers
        subject: options.subject, // Subject line
        html: options.html, // html body
      });

      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}

export default EmailSender;
