import { nanoid } from "nanoid";
import { Op } from "sequelize";
import Url from "../db/models/urls.js";
import File from "../db/models/files.js";
import GenerateFileUrl from "../services/File/GenerateFileUrl..js";
import CustomError from "../errors/index.js";
import { StatusCodes } from "http-status-codes";

export const GetUrl = async (req, res) => {
  const { id: urlId } = req.params;

  if (!urlId) {
    throw new CustomError.BadRequestError("Invalid Url");
  }

  const url = await Url.findOne({ where: { urlId } });
  if (!url) {
    throw new CustomError.BadRequestError("Invalid Url");
  }

  const file = await File.findOne({ where: { id: url.fileId } });

  const sharedUser = await File.findOne({
    where: { sharedUsers: { [Op.contains]: [req.user.userId] } },
  });

  if (file.userId !== req.user.userId && !sharedUser) {
    throw new CustomError.UnauthorizedError("Unauthorized access");
  }

  file.openedAt = Date.now();
  file.clicks += 1;

  await file.save();

  res.status(StatusCodes.OK).redirect(url.origUrl);
};

export const createUrl = async ({ file }) => {
  if (!file) {
    throw new CustomError.BadRequestError("Please provide Url");
  }

  let url = await Url.findOne({ where: { fileId: file.id } });
  if (url) {
    return url.shortUrl;
  }

  const urlId = nanoid();
  const origUrl = await GenerateFileUrl({ fileName: file.fileName });
  const expireAt = new Date(
    Date.now() + Number(process.env.FILE_EXPIRE) * 1000
  );

  url = await Url.create({
    urlId,
    origUrl,
    shortUrl: `${process.env.ORIGIN}/api/v1/url/${urlId}`,
    expireAt,
    fileId: file.id,
  });

  return url.shortUrl;
};
