const nodemailer = require("nodemailer");

const sendMail = async ({ to, subject, text }) => {
  const response = await fetch("https://resend.com/docs/create-an-api-key", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev",
      to,
      subject,
      text,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to send email");
  }
};

module.exports = sendMail;
