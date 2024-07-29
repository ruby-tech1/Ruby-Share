import User from "../models/User.js";
import Token from "../models/Token.js";
import {
  attachCookieToResponse,
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
} from "../utils/index.js";
import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/index.js";
import crypto from "crypto";
import otp from "otp-generator";

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExist = await User.findOne({ email });
  if (emailAlreadyExist) {
    throw new CustomError.BadRequestError("Email already exist");
  }

  // const isFirstAccount = (await User.countDocuments({})) === 0;
  // const role = isFirstAccount ? "admin" : "user";

  // const verificationCode = crypto.randomBytes(40).toString("hex");
  let tempVerificationCode = otp.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  console.log(tempVerificationCode);

  const user = await User.create({
    email,
    name,
    password,
    role: "user",
    storageLimit: process.env.USER_MAXSIZE,
    verificationCode: createHash(tempVerificationCode),
  });

  // const origin = 'http://localhost:3000'

  // const originEx = req.get('origin')
  // const protocol = req.protocol;
  // const host = req.get('host');
  // const fowardedHost = req.get('x-forwarded-host')
  // const fowardedProtocol = req.get('x-forwarded-proto')
  // console.log(`origin: ${originEx}, protocol: ${protocol}, host: ${host}, forwardedHost: ${fowardedHost} forwardedprotocol: ${fowardedProtocol}`)

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    code: tempVerificationCode,
  });

  tempVerificationCode = "";

  res.status(StatusCodes.CREATED).json({
    msg: "Success, Please check email to verify account",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError(
      "Please provide valid credentials"
    );
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new CustomError.UnauthenticatedError(
      "Please provide valid credentials"
    );
  }

  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError("Please verify email");
  }

  const tokenUser = createTokenUser({ user });

  // create refresh token
  let refreshToken = "";

  // check for existing token
  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }
    refreshToken = existingToken.refreshToken;
    attachCookieToResponse({ res, tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };

  await Token.create(userToken);

  attachCookieToResponse({ res, tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({
    user: tokenUser,
  });
};

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId });

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ success: true });
};

const verifyEmail = async (req, res) => {
  const { verificationCode, email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Verification Failed");
  }

  if (user.verificationCode !== createHash(verificationCode)) {
    throw new CustomError.UnauthenticatedError("Verification Failed");
  }

  user.isVerified = true;
  user.verified = Date.now();
  user.verificationCode = "";

  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Email Verified" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError.BadRequestError("Please provide valid email");
  }

  const user = await User.findOne({ email });
  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");
    const fifteenMinutes = 1000 * 60 * 15;

    // send email
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      passwordToken,
      origin: process.env.ORIGIN,
    });

    const passwordTokenExpirationDate = new Date(Date.now() + fifteenMinutes);
    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check email for reset password link" });
};

const resetPassword = async (req, res) => {
  const { email, password, token } = req.body;

  if (!email || !password || !token) {
    throw new CustomError.BadRequestError("Please provide all values");
  }

  const user = await User.findOne({ email });

  if (user) {
    const currentDate = new Date();
    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }

  res.status(StatusCodes.OK).json({ msg: "reset password" });
};

export { login, logout, register, verifyEmail, forgotPassword, resetPassword };
