import nodemailer from 'nodemailer';

const { GOOGLE_APP_EMAIL, GOOGLE_APP_PASS } = process.env;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: GOOGLE_APP_EMAIL, // replace with your email
    pass: GOOGLE_APP_PASS, // replace with your password
  },
  secure: true,
});

export default transporter;

