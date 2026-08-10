import nodemailer from 'nodemailer';
import { decrypt } from './crypto';
export async function sendContactNotification(settings, message){
  if(!settings?.notification_email || !settings?.smtp_host || !settings?.smtp_user || !settings?.smtp_password_encrypted) return {skipped:true};
  const password=decrypt(settings.smtp_password_encrypted);
  if(!password) return {skipped:true};
  const transporter=nodemailer.createTransport({ host:settings.smtp_host, port:Number(settings.smtp_port||465), secure:Boolean(settings.smtp_secure), auth:{user:settings.smtp_user,pass:password} });
  await transporter.sendMail({ from:`${settings.from_name||settings.site_name||'Website'} <${settings.smtp_user}>`, to:settings.notification_email, replyTo:message.email, subject:`New website enquiry: ${message.subject||'Contact form'}`, text:`Name: ${message.name}\nEmail: ${message.email}\nSubject: ${message.subject||''}\n\n${message.message}` });
  return {sent:true};
}
