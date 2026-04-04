// src/utils/sendMail.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465, // true для 465 (SSL)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Універсальна функція для надсилання email.
 * @param {Object} options
 * @param {string} options.to - адреса одержувача
 * @param {string} options.subject - тема листа
 * @param {string} [options.text] - текст листа (plain text)
 * @param {string} [options.html] - HTML-версія листа
 * @param {string} [options.from] - від кого надсилається лист
 * @returns {Promise<object>} - результат надсилання
 */
export const sendEmail = async ({ to, subject, text, html, from }) => {
  const mailOptions = {
    from: from || `"No Reply" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};
