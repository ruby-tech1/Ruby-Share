import sendEmail from "./sendEmail.js";

export const sendFileSharerEmail = async ({
  name,
  email,
  sharedEmail,
  fileName,
}) => {
  const messageToSharer = `<h5>You shared a file to: ${sharedEmail}.<h5><h5>File: ${fileName}</h5>`;

  return sendEmail({
    to: email,
    subject: "File Shared",
    html: `<h3>Hello, ${name} </h3> ${messageToSharer}`,
  });
};

export const sendFileSharedEmail = async ({
  name,
  email,
  sharedEmail,
  fileName,
}) => {
  const messageToShared = `<h5>A file has been shared to you from: ${email}.</h><h5>File: ${fileName}</h5>`;

  return sendEmail({
    to: sharedEmail,
    subject: "File Shared",
    html: `<h3>Hello, ${name} </h3> ${messageToShared}`,
  });
};
