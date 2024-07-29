import { createJWT, isTokenValid, attachCookieToResponse } from "./jwt.js";
import createTokenUser from "./createTokenUser.js";
import checkPermissions from "./checkPermissions.js";
import sendVerificationEmail from "./sendVerificationEmail.js";
import sendResetPasswordEmail from "./sendResetPasswordEmail.js";
import __dirname from "./dirname.js";
import { randomHash, createHash } from "./createHash.js";
import S3Client from "./S3Client.js";
import removeAllFiles from "./EmptyDir.js";
import {
  sendFileSharerEmail,
  sendFileSharedEmail,
} from "./sendFileSharedEmail.js";

export {
  createJWT,
  isTokenValid,
  attachCookieToResponse,
  createTokenUser,
  checkPermissions,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
  __dirname,
  randomHash,
  S3Client,
  removeAllFiles,
  sendFileSharerEmail,
  sendFileSharedEmail,
};
