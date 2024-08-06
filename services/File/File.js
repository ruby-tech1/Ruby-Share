import File from "../../db/models/files.js";
import User from "../../db/models/user.js";
import eventEmitter from "../../events/eventEmitter.js";
import { createUrl } from "../../controllers/UrlController.js";
import { Op } from "sequelize";
import CustomError from "../../errors/index.js";

export const createFileService = async (param) => {
  const { fileUpload, userId } = param;

  if (Array.isArray(fileUpload)) {
    for (const item of fileUpload) {
      const file = await File.findOne({
        where: { name: item.name, userId },
      });
      if (file) {
        throw new CustomError.BadRequestError("File already exist");
      }

      eventEmitter.emit("fileCreated", { file: item, userId });
    }
  } else {
    const file = await File.findOne({
      where: { name: fileUpload.name, userId },
    });
    if (file) {
      throw new CustomError.BadRequestError("File already exist");
    }

    eventEmitter.emit("fileCreated", { file: fileUpload, userId });
  }
};

export const GetAllFilesService = async (param) => {
  let { search, mimetype, sort, shared, page, limit, userId } = param;

  let order = [];
  let queryObject = { userId };

  if (shared) {
    queryObject = { sharedUsers: { [Op.contains]: [userId] } };
  }

  if (search) {
    queryObject.name = { [Op.iLike]: `%${search}%` }; // Use Op.like for case sensitive search matching
  }

  if (mimetype) {
    queryObject.mimetype = { [Op.iLike]: `%${mimetype}%` };
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

  const files = await File.findAll({
    where: queryObject,
    order,
    limit,
    offset: skip,
  });

  if (!files) {
    throw new CustomError.NotFoundError("No files available");
  }

  let tempFiles = [];
  for (const item of files) {
    let url = await createUrl({
      file: item,
    });
    tempFiles = [
      ...tempFiles,
      {
        id: item.id,
        name: item.name,
        size: item.size,
        mimetype: item.mimetype,
        isFileShared: item.isFileShared,
        user: item.user,
        sharedUsers: !shared ? item.sharedUsers : "",
        url,
      },
    ];
  }

  return tempFiles;
};

export const updateFileService = async (param) => {
  const { sharedUsers, name, fileId, userId, userName, userEmail } = param;

  let file = await File.findOne({ where: { id: fileId, userId } });
  if (!file) {
    throw new CustomError.NotFoundError("File not found");
  }

  if (name) {
    file.name = name;
  }

  if (sharedUsers) {
    file.sharedUsers = [...file.sharedUsers, ...sharedUsers];
    if (!file.isFileShared) {
      file.isFileShared = true;
    }

    for (let user of sharedUsers) {
      const shared = await User.findOne({ where: { id: user } });

      eventEmitter.emit("fileShared", {
        userEmail,
        userName,
        shared,
        fileName: file.name,
      });
    }
  }

  file = await file.save();

  return file;
};
