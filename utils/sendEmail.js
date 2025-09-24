// utils/sendEmail.js

const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    // secure: false is required for port 587, which uses STARTTLS
    secure: false, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // --- THIS IS THE CRITICAL DEBUGGING CODE ---
    // It will log the entire SMTP conversation to the console
    logger: true,
    debug: true 
  });

  const mailOptions = {
    from: `"NEXUS Support" <${process.env.SMTP_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    console.log("Attempting to send mail...");
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully! Server Response:", info.response);
    return info; // Return the success info
  } catch (error) {
    // This will now catch and display a much more detailed error
    console.error("CRITICAL ERROR sending email:", error);
    // Re-throw the error so the controller's catch block is triggered
    throw new Error("Email could not be sent. Check server logs for details."); 
  }
};

module.exports = sendEmail;