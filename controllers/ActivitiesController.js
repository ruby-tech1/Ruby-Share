import Activities from "../db/models/activities.js";
import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/index.js";

export const getActivities = async (req, res) => {
  const activity = await Activities.findAll();

  res.status(StatusCodes.OK).json(activity);
};

export const createActivity = async ({ userId, propertyId, activityType }) => {
  if (!userId || !activityType) {
    throw new CustomError.BadRequestError("Please provide all values");
  }

  const activity = await Activities.create({
    userId,
    propertyId,
    activityType,
  });
};
