const nodemailer = require("nodemailer");
const dotEnv = require("dotenv");
dotEnv.config();

const gmailTransporter = {
  //   host: "smtp.mailgun.org",
  //   port: 587,
  //   auth: {
  //     user: "api",
  //     pass: "pubkey-0c6f9f7a2267f352a5fd6293a1db6a95",
  //   },
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASSWORD,
  },
};

const emailDetails = {
  to: ["bhavyaa1019@gmail.com"],
  from: { name: "kinshu.1019@gmail.com", address: process.env.USER },
  subject: "Subject is subject",
  text: "Bhavya hope this mail finds you well",
  html: "<strong>Hi There Bhavya See you finally made it</strong>",
};

const transporter = nodemailer.createTransport(gmailTransporter);

transporter
  .sendMail(emailDetails)
  .then(() => {
    console.log("email sent");
  })
  .catch((err) => {
    console.log(err);
  });
