import type { Transporter } from "nodemailer";
import nodemailer from "nodemailer";

import { emailEnv } from "../env";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

let transporterInstance: Transporter | null = null;

/**
 * Lazily creates and caches the Nodemailer transporter instance.
 */
const getTransporter = (): Transporter => {
  if (transporterInstance) return transporterInstance;

  const env = emailEnv();

  transporterInstance = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: Number(env.SMTP_PORT) === 465, // true for 465, false for others
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  return transporterInstance;
};

/**
 * Sends an email using the configured transporter.
 */
export const sendEmail = async ({
  to,
  subject,
  html,
  text,
  from,
}: SendEmailParams) => {
  const env = emailEnv();
  const transporter = getTransporter();

  try {
    const mailOptions = {
      from: from ?? env.SMTP_FROM_EMAIL,
      to,
      subject,
      text: text ?? html,
      html,
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "Email sent successfully.",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
