const nodemailer = require("nodemailer");

const sendMail = async () => {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"Karishma" <' + testAccount.user + ">",
    to: testAccount.user,
    subject: "Hello Thapa",
    text: "Hello world?",
    html: "<b>Hello world?</b>",
  });
};

module.exports = sendMail;
