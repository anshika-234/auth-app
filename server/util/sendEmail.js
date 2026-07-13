const sendMail = async ({ to, subject, text }) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Auth App <onboarding@resend.dev>",
      to,
      subject,
      text,
    }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to send email";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = (await response.text()) || errorMessage;
    }
    throw new Error(errorMessage);
  }
};

module.exports = sendMail;
