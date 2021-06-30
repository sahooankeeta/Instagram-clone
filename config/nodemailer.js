const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "acsahoo64@gmail.com",
    pass: "enfkvcsjjbjqaoim",
  },
});

let renderTemplate = (data, relativePath) => {
  let mailHTML;
  ejs.renderFile(
    path.join(__dirname, "../views/mailers", relativePath),
    data,
    function (err, template) {
      if (err) {
        console.log("err in nodemailer", err);
        return;
      }
      mailHTML = template;
    }
  );
  return mailHTML;
};
module.exports = {
  transporter: transporter,
  renderTemplate: renderTemplate,
};
