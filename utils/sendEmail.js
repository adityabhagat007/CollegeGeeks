require("dotenv").config();
const nodemailer = require("nodemailer");

module.exports = (email, subject, text) => {
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  let mailDetails = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    html: text,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};
