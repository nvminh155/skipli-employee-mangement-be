const { transporter } = require("../lib/nodemailer");

const smsService = {
  sendPinCode: async (to, subject, pinCode) => {
    transporter.sendMail({
      to: to,
      subject: subject,
      html: `Your pin code is <b>${pinCode}</b>`, // HTML body
    });
  },
};

module.exports = {
  smsService,
};
