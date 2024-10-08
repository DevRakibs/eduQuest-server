/* eslint-disable no-undef */
import fs from 'fs';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export const sendVerificationEmail = async (email, token) => {
  const templatePath = path.join(
    __dirname,
    '../emailTemplate/registrationTemplate.html'
  );
  let htmlContent = fs.readFileSync(templatePath, 'utf8');

  htmlContent = htmlContent.replace('{{token}}', token);

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Verify your email',
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

export const sendAdminUserCreateEmail = async (
  email,
  verificationToken,
  password
) => {

  const templatePath = path.join(
    __dirname,
    '../emailTemplate/adminUserCreateTemplate.html'
  );
  let htmlContent = fs.readFileSync(templatePath, 'utf8');

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  htmlContent = htmlContent.replace('{{verificationUrl}}', verificationUrl);
  htmlContent = htmlContent.replace('{{password}}', password);

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Welcome to Our Platform - Verify Your Email',
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

// send password reset email
export const sendPasswordResetEmail = async (email, resetUrl) => {
  const templatePath = path.join(
    __dirname,
    '../emailTemplate/passwordResetTemplate.html'
  );
  let htmlContent = fs.readFileSync(templatePath, 'utf8');

  htmlContent = htmlContent.replace('{{resetUrl}}', resetUrl);

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Reset Request',
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

// send password reset confirmation email
export const sendPasswordResetConfirmationEmail = async (email) => {
  const templatePath = path.join(
    __dirname,
    '../emailTemplate/passwordResetConfirmationTemplate.html'
  );
  let htmlContent = fs.readFileSync(templatePath, 'utf8');

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Reset Successful',
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

// export const sendVerificationEmail = async (email, token) => {
//   const mailOptions = {
//     from: 'poshcoderbd@gmail.com',
//     to: email,
//     subject: 'Posh Coder Email Verification',
//     text: `Please verify your email by clicking the following link:
//     https://www.poshcoder.com/verify-email?token=${token}`
//   };

//   await transporter.sendMail(mailOptions);
// };

// // send order create email
// export const sendOrderCreateEmail = async (orderDetails) => {

//   const templatePath = path.resolve(__dirname, '../emailTemplate/orderCreateTemplate.html');
//   let htmlContent = fs.readFileSync(templatePath, 'utf8');

//   htmlContent = htmlContent.replace('{{orderName}}', orderDetails.orderName)
//                            .replace('{{name}}', orderDetails.name)
//                            .replace('{{phone}}', orderDetails.phone)
//                            .replace('{{desc}}', orderDetails.desc)
//                            .replace('{{status}}', orderDetails.status)
//                            .replace('{{username}}', orderDetails.user.username)
//                            .replace('{{email}}', orderDetails.user.email);

//   const mailOptions = {
//     from: 'poshcoderbd@gmail.com',
//     to: 'poshcoderbd@gmail.com',
//     subject: 'New Order Placed',
//     html: htmlContent, // Use the HTML template
//   };

//   await transporter.sendMail(mailOptions);
// };

// send order confirmation to the user
// export const sendUserOrderConfirmationEmail = async (orderDetails) => {
//   const templatePath = path.resolve(__dirname, '../emailTemplate/userOrderConfirmationTemplate.html');
//   let htmlContent = fs.readFileSync(templatePath, 'utf8');

//   htmlContent = htmlContent.replace('{{name}}', orderDetails.name)
//                            .replace('{{orderName}}', orderDetails.orderName)
//                            .replace('{{status}}', orderDetails.status)
//                            .replace('{{desc}}', orderDetails.desc)
//                            .replace('{{phone}}', orderDetails.phone);

//   const mailOptions = {
//     from: 'poshcoderbd@gmail.com',
//     to: orderDetails.user.email,
//     subject: 'Your Order Confirmation',
//     html: htmlContent
//   };

//   await transporter.sendMail(mailOptions);
// };
