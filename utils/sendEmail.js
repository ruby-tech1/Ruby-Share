import nodemailer from "nodemailer";
import nodemailerConfig from "./nodemailerConfig.js";
// import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'

// const sendEmailMailerSend = async ({toEmail, subject, templateId, toName }) => {
//     try {
//         const mailerSend = new MailerSend({
//             apiKey: process.env.MAILSENDER_SECRET,
//         });

//         const sentFrom = new Sender("security@ruby-dev.site", "Security Ruby Dev");
//         const recipients = [
//             new Recipient("reubenalabi2006@gmail.com", "Reuben")
//         ];
//         const personalization = [{
//             email: "reubenalabi2006@gmail.com",
//             data: {
//                 link: { link: "https://www.google.com" },
//                 email: { support: 'support@ruby-dev.site' },
//                 account: { name: 'Ruby' },
//             }
//         }]

//         const emailParams = new EmailParams()
//             .setFrom(sentFrom)
//             .setTo(recipients)
//             .setSubject("Testing Email")
//             .setTemplateId("0p7kx4xx1mv49yjr")
//             .setPersonalization(personalization)
//         // .setHtml("<strong>This is the HTML content</strong>")
//         // .setText("This is the text content");

//         await mailerSend.email.send(emailParams);
//     } catch (error) {
//         console.log(error)
//     }
// }

const sendEmailMailerSend = async ({ to, subject, html }) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport(nodemailerConfig);

  return transporter.sendMail({
    from: '"Ruby-Dev" <security@ruby-dev.site>', // sender address
    to,
    subject,
    html,
  });
};

export default sendEmailMailerSend;
