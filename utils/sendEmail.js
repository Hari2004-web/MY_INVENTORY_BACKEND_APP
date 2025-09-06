const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // This new configuration does NOT connect to the internet.
  // It "sends" the email by printing its contents directly to your backend terminal.
  // This is the most reliable method for local development and testing.
  const transporter = nodemailer.createTransport({
    jsonTransport: true,
  });

  // Define the email options
  const mailOptions = {
    from: '"Inventory App Admin" <admin@inventory.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // "Send" the email
  const info = await transporter.sendMail(mailOptions);

  console.log("\n--- EMAIL SENT TO CONSOLE (JSON Transport) ---");
  console.log("The following email object was successfully created:");
  // The 'info.message' is a JSON string, so we parse it to log it as a readable object
  console.log(JSON.parse(info.message));
  console.log("---------------------------------------------\n");
};

module.exports = sendEmail;