import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { NEWS_SUMMARY_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "@/lib/nodemailer/templates";

/**
 * Nodemailer transporter configuration
 * Uses Gmail SMTP with environment credentials
 */
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL!,
    pass: process.env.NODEMAILER_PASSWORD!,
  }
});

const makeUnsubLink = (email: string) => {
  const base = process.env.NEXT_PUBLIC_BASE_URL || '#';
  const t = Date.now().toString();
  const secret = process.env.EMAIL_UNSUB_SECRET!;
  const sig = crypto.createHmac('sha256', secret).update(`${email}|${t}`).digest('hex');
  const url = new URL('/api/email/unsubscribe', base);
  url.searchParams.set('email', email);
  url.searchParams.set('t', t);
  url.searchParams.set('sig', sig);
  return url.toString();
};

/**
 * Send personalized welcome email to new users
 * @param email - User's email address
 * @param name - User's full name
 * @param intro - AI-generated personalized introduction
 */
export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
  const dashboardUrl = process.env.NEXT_PUBLIC_BASE_URL || '#';
  const unsubscribeUrl = makeUnsubLink(email);

  const htmlTemplate = WELCOME_EMAIL_TEMPLATE
    .replace('{{name}}', name)
    .replace('{{intro}}', intro)
    .replaceAll('{{unsubscribeUrl}}', unsubscribeUrl)
    .replaceAll('{{dashboardUrl}}', dashboardUrl);

  const mailOptions = {
    from: `"Signalist" <trongtran.javadev@gmail.com>`,
    to: email,
    subject: `[BGH] [Training] Welcome to Signalist - Your stock market toolkits is ready!`,
    text: `Thanks for joining Signalist. To stop daily emails: ${unsubscribeUrl}`,
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
}

/**
 * Send daily news summary email
 * @param email - User's email address
 * @param date - Current date formatted for display
 * @param newsContent - AI-generated news summary
 */
export const sendNewsSummaryEmail = async ({ email, date, newsContent }: NewsSummaryEmailData) => {
  const unsubscribeUrl = makeUnsubLink(email);
  const dashboardUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');

  const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
    .replace('{{newsContent}}', newsContent)
    .replace('{{date}}', date)
    .replaceAll('{{unsubscribeUrl}}', unsubscribeUrl)
    .replaceAll('{{dashboardUrl}}', dashboardUrl);

  const mailOptions = {
    from: `"Signalist News" <${process.env.NODEMAILER_EMAIL}>`,
    to: email,
    subject: `[BGH] [Training] Market News Summary Today - ${date}`,
    text: `Today's market news summary from Signalist. To stop daily emails: ${unsubscribeUrl}`,
    html: htmlTemplate,
  };

  try {
    console.log(`Sending daily news summary email to ${email}`);
    const result = await transporter.sendMail(mailOptions);
    console.log(`Daily news email sent successfully to ${email}:`, result.messageId);
    return { success: true, messageId: result.messageId };

  } catch (e) {
    console.error(`Failed to send daily news email to ${email}`);
    throw e;
  }
}
