const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "minhnv155@gmail.com",
    pass: process.env.NODEMAILER_GOOGLE_APP_PASSWORD,
  },
});

module.exports = {
  transporter,
};