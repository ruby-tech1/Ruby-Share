import sendEmail from "./sendEmail.js";

const sendResetPasswordEmail = async ({
  name,
  email,
  passwordToken,
  origin,
}) => {
  const resetPasswordURL = `${origin}/user/reset-password?token=${passwordToken}&email=${email}`;
  const message = `<p>Please reset password by clicking the link: <a href="${resetPasswordURL}">Reset Password</a></p>`;

  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h4>Hello, ${name} </h4> ${message}`,
  });
};

export default sendResetPasswordEmail;
