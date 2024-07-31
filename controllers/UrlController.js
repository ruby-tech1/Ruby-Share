import { nanoid } from "nanoid";
import Url from "../models/Url.js";
import File from "../models/File.js";
import CustomError from "../errors/index.js";
import { StatusCodes } from "http-status-codes";

export const GetUrl = async (req, res) => {
  const { id: urlId } = req.params;

  if (!urlId) {
    throw new CustomError.BadRequestError("Invalid Url");
  }

  const url = await Url.findOne({ urlId });
  if (!url) {
    throw new CustomError.BadRequestError("Invalid Url");
  }

  const file = await File.findOne({ _id: url.file });

  const sharedUser = file.sharedUsers.find((user) => {
    return user.toString() === req.user.userId;
  });

  if (file.user.toString() !== req.user.userId && !sharedUser) {
    throw new CustomError.UnauthorizedError("Unauthorized access");
  }

  file.openedAt = Date.now();
  file.clicks += 1;

  await file.save();

  res.status(StatusCodes.OK).redirect(url.origUrl);
};

export const createUrl = async ({ file, S3 }) => {
  if (!file || !S3) {
    throw new CustomError.BadRequestError("Please provide Url");
  }

  let url = await Url.findOne({ file: file._id });
  if (url) {
    return url.shortUrl;
  }

  const urlId = nanoid();
  const origUrl = await file.getUrl({ S3Client: S3, fileName: file.fileName });
  const expireAt = new Date(
    Date.now() + Number(process.env.FILE_EXPIRE) * 1000
  );

  url = await Url.create({
    urlId,
    origUrl,
    shortUrl: `${process.env.ORIGIN}/api/v1/url/${urlId}`,
    expireAt,
    file,
  });

  return url.shortUrl;
};
