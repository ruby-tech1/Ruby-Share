import File from "../db/models/files.js";
import {
  updateFileService,
  createFileService,
  GetAllFilesService,
} from "../services/File/File.js";
import { createActivity } from "./ActivitiesController.js";
import { createUrl } from "./UrlController.js";
import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/index.js";
import { Op } from "sequelize";
import eventEmitter from "../events/eventEmitter.js";

export const createFile = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError("No File Uploaded");
  }

  const {
    files: { fileUpload },
    user: { userId },
  } = req;

  await createFileService({ userId, fileUpload });

  res.status(StatusCodes.CREATED).json({ msg: "files uploaded" });
};

export const getAllFiles = async (req, res) => {
  const {
    query: { search, mimetype, sort, shared, page, limit },
    user: { userId },
  } = req;

  const files = await GetAllFilesService({
    search,
    mimetype,
    sort,
    shared,
    page,
    limit,
    userId,
  });

  await createActivity({
    userId,
    activityType: "get files",
  });
  res.status(StatusCodes.OK).json({ nHits: files.length, files });
};

export const getSingleFile = async (req, res) => {
  const {
    user: { userId },
    params: { id: fileId },
  } = req;

  const queryObject = { id: fileId };

  if (req.query.shared) {
    queryObject.sharedUsers = { [Op.contains]: [userId] };
  } else {
    queryObject.userId = userId;
  }

  const file = await File.findOne({ where: queryObject });
  if (!file) {
    throw new CustomError.NotFoundError("File not found");
  }

  let url = await createUrl({
    file,
  });
  const tempFile = {
    id: file.id,
    name: file.name,
    size: file.size,
    user: file.user,
    mimetype: file.mimetype,
    isFileShared: file.isFileShared,
    url,
  };

  await createActivity({
    userId,
    activityType: "get file",
  });
  res.status(StatusCodes.OK).json({ file: tempFile });
};

export const updateFile = async (req, res) => {
  const {
    body: { sharedUsers, name },
    params: { id: fileId },
    user: { userId, name: userName, email: userEmail },
  } = req;

  const file = await updateFileService({
    sharedUsers,
    name,
    fileId,
    userId,
    userName,
    userEmail,
  });

  await createActivity({
    userId,
    propertyId: fileId,
    activityType: "updated file",
  });
  res.status(StatusCodes.CREATED).json({ file });
};

export const deleteFIle = async (req, res) => {
  const { id: fileId } = req.params;

  const file = await File.findOne({
    where: {
      id: fileId,
      userId: req.user.userId,
    },
  });

  if (!file) {
    throw new CustomError.NotFoundError("File not found");
  }

  eventEmitter.emit("fileDeleted", {
    fileName: file.fileName,
  }); // In complete production don't delete the file.

  await File.destroy({ where: { id: fileId } });

  await createActivity({
    userId,
    propertyId: fileId,
    activityType: "updated file",
  });
  res.status(StatusCodes.OK).json({ msg: "File Deleted" });
};
