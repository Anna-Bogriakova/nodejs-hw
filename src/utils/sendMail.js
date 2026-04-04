import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, templateName, context }) => {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "templates",
    `${templateName}.html`
  );
  const html = fs.readFileSync(templatePath, "utf8");
  const compiled = Handlebars.compile(html);
  const htmlToSend = compiled(context);

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html: htmlToSend,
  });

  return info;
};
