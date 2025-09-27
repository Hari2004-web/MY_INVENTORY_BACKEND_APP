// utils/sendEmail.js

const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT, // This will correctly use port 587 from .env
    secure: false, // This MUST be false for port 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS, // This must be your 16-digit Google App Password
    },
    // Optional: Add a timeout for better error handling
    connectionTimeout: 10000, // 10 seconds
  });

  const mailOptions = {
    from: `"NEXUS Support" <${process.env.SMTP_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("FAILED TO SEND EMAIL:", error);
    throw new Error("Email could not be sent. Please check the server logs.");
  }
};

module.exports = sendEmail;