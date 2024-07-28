import sendEmail from "./sendEmail.js";

const sendVerificationEmail = async ({ name, email, code }) => {
  // const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;

  // const message = `<p>Please confirm your email by clicking on the following link: <a href="${verifyEmail}" target="_blank">Verify Email</a> </p>`;
  const message = `<p>Email Verfication OTP: ${code} </p>`;

  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4>Hello, ${name}<h4> ${message}`,
  });
};

export default sendVerificationEmail;
