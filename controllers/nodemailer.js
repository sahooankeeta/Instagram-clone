const nodemailer = require("nodemailer");
const sendEmail = (options) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
  });
};
