import eventEmitter from "./eventEmitter.js";
import {
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendFileSharedEmail,
  sendFileSharerEmail,
} from "../services/Email/index.js";

eventEmitter.on("sendVerification", async ({ user }) => {
  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    code: user.verificationCode,
  });
});

eventEmitter.on("forgotPassword", async ({ user, passwordToken }) => {
  await sendResetPasswordEmail({
    name: user.name,
    email: user.email,
    passwordToken,
    origin: process.env.ORIGIN,
  });
});

eventEmitter.on(
  "fileShared",
  async ({ userName, userEmail, shared, fileName }) => {
    await sendFileSharerEmail({
      name: userName,
      email: userEmail,
      sharedEmail: shared.email,
      fileName,
    });
    await sendFileSharedEmail({
      name: shared.name,
      email: userEmail,
      sharedEmail: shared.email,
      fileName,
    });
  }
);
