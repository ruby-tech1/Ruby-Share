import User from "../db/models/user.js";
import { createActivity } from "./ActivitiesController.js";
import { Op } from "sequelize";
import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/index.js";
import {
  createTokenUser,
  attachCookieToResponse,
  checkPermissions,
} from "../utils/index.js";

export const getAllUsers = async (req, res) => {
  let { name, email, sort, page, limit } = req.query;

  let queryObject = { role: "user" };
  let order = [];

  if (req.user.role === "admin") {
    queryObject = {};
  }

  if (name) {
    queryObject.name = { [Op.iLike]: `%${name}%` };
  }

  if (email) {
    queryObject.email = { [Op.iLike]: `%${email}%` };
  }

  if (sort === "latest") {
    order = [...order, ["createdAt", "DESC"]];
  }

  if (sort === "earliest") {
    order = [...order, ["createdAt", "ASC"]];
  }

  if (sort === "a-z") {
    order = [...order, ["name", "ASC"]];
  }

  if (sort === "z-a") {
    order = [...order, ["name", "DESC"]];
  }

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;
  const skip = (page - 1) * limit;

  const users = await User.findAll({
    where: queryObject,
    attributes: ["id", "name", "email", "isVerified"],
    order,
    limit,
    offset: skip,
  });

  await createActivity({ userId: req.user.userId, activityType: "get users" });
  res.status(StatusCodes.OK).json({ users });
};

export const getSingleUser = async (req, res) => {
  const user = await User.findOne({
    where: { id: req.params.id },
    attributes: ["id", "name", "email", "isVerified", "createdAt", "updatedAt"],
  });
  if (!user) {
    throw new CustomError.NotFoundError(
      `No user with id ${req.params.id} was found`
    );
  }

  checkPermissions(req.user, user.id);

  await createActivity({ userId: req.user.userId, activityType: "get user" });
  res.status(StatusCodes.OK).json({ user });
};
export const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

export const updateUser = async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findOne({ where: { id: req.user.userId } });
  if (email) {
    user.email = email;
  }

  if (name) {
    user.name = name;
  }
  await user.save();

  const tokenUser = createTokenUser({ user });
  attachCookieToResponse({ res, tokenUser });

  await createActivity({
    userId: req.user.userId,
    activityType: "updated user",
  });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

export const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide both values");
  }

  const user = await User.findOne({ where: { id: req.user.userId } });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  user.password = newPassword;
  await user.save();

  await createActivity({
    userId: req.user.userId,
    activityType: "updated password",
  });
  res.status(StatusCodes.OK).json({ msg: "success! password updated" });
};
