
import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config()

// =============================== send email subject ================================
export const emailSubjects = {
  activateAccount: "Activate Your Account",
  forgotPassword: "Reset Your Password",
  verifyEmail: "Verify Your Email",
};
export const sendEmails = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.ethereal.email",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: `"CharityNet.org" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
};
