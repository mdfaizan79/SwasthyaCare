import nodemailer from 'nodemailer';
import env from '../config/env.js';
import logger from '../config/logger.js';

function getTransporter() {
  if (env.mail.transport === 'json') {
    return nodemailer.createTransport({ jsonTransport: true });
  }

  return nodemailer.createTransport({
    host: env.mail.host,
    port: env.mail.port,
    secure: false,
    auth: env.mail.user ? { user: env.mail.user, pass: env.mail.pass } : undefined
  });
}

const transporter = getTransporter();

export async function sendPasswordResetEmail(email, resetUrl) {
  try {
    const info = await transporter.sendMail({
      from: env.mail.from,
      to: email,
      subject: 'Reset your Swasthya Care password',
      text: `Reset your password using this link: ${resetUrl}`
    });

    logger.info(`Password reset email queued: ${info.messageId ?? 'json-transport'}`);
  } catch (error) {
    logger.error(`Failed to send reset email: ${error.message}`);
  }
}

export async function notifyAppointmentChange({ to, message }) {
  logger.info(`Notification placeholder -> ${to}: ${message}`);
}
