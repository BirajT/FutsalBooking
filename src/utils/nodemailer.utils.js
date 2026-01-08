import nodemailer from "nodemailer";
import { nodemailer_config } from "../config/config.js";


const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
     user: nodemailer_config.user,
    pass: nodemailer_config.pass
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transport.sendMail({
      from: `"Futsal App" <${nodemailer_config.user}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending error:", error.message);
  }
};

