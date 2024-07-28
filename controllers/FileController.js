import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { promises as fs } from "fs";
import File from "../models/File.js";
import {
  randomHash,
  S3Client,
  removeAllFiles,
  __dirname,
} from "../utils/index.js";
import path from "path";
import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/index.js";

import dotenv from "dotenv";
dotenv.config();

export const createFile = async (req, res) => {
  const {
    files: { fileUpload },
    user: { userId },
  } = req;

  if (!req.files) {
    throw new CustomError.BadRequestError("No File Uploaded");
  }

  let fileCreated = [];

  if (Array.isArray(fileUpload)) {
    for (const item of fileUpload) {
      const file = await File.findOne({ name: item.name, user: userId });
      if (file) {
        throw new CustomError.BadRequestError("File already exist");
      }

      const fileContent = await fs.readFile(item.tempFilePath);
      const fileName = randomHash();

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: fileName,
        Body: fileContent,
        ContentType: item.mimetype,
      });
      await S3Client.send(command);

      const fileSchema = await File.create({
        name: item.name,
        fileName,
        size: item.size,
        mimetype: item.mimetype,
        user: userId,
      });

      fileCreated = [
        ...fileCreated,
        { name: fileSchema.name, url: fileSchema.url },
      ];
    }
  } else {
    const file = await File.findOne({ name: fileUpload.name, user: userId });
    if (file) {
      throw new CustomError.BadRequestError("File already exist");
    }

    const fileContent = await fs.readFile(fileUpload.tempFilePath);
    const fileName = randomHash();

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
      Body: fileContent,
      ContentType: fileUpload.mimetype,
    });
    await S3Client.send(command);

    const fileSchema = await File.create({
      name: fileUpload.name,
      fileName,
      size: fileUpload.size,
      mimetype: fileUpload.mimetype,
      user: userId,
    });

    fileCreated = [
      ...fileCreated,
      { name: fileSchema.name, url: fileSchema.url },
    ];
  }

  await removeAllFiles(path.join(__dirname, "../tmp"));
  res
    .status(StatusCodes.CREATED)
    .json({ nHits: fileCreated.length, files: fileCreated });
};

export const getAllFiles = async (req, res) => {
  const { search, mimetype, sort } = req.query;

  const queryObject = { user: req.user.userId };

  if (search) {
    queryObject.name = { $regex: search, $options: "i" };
  }

  if (mimetype) {
    queryObject.mimetype = { $regex: mimetype, $options: "i" };
  }

  let result = File.find(queryObject);

  if (sort === "latest") {
    result = result.sort("-createdAt");
  }

  if (sort === "earliest") {
    result = result.sort("-createdAt");
  }

  if (sort === "a-z") {
    result = result.sort("name");
  }

  if (sort === "z-a") {
    result = result.sort("-name");
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const files = await result;

  if (!files) {
    throw new CustomError.NotFoundError("No files available");
  }

  let tempFiles = [];
  for (const item of files) {
    const url = await item.getUrl(S3Client, item.fileName);
    tempFiles = [
      ...tempFiles,
      {
        _id: item._id,
        name: item.name,
        size: item.size,
        mimetype: item.mimetype,
        isFileShared: item.isFileShared,
        url,
      },
    ];
  }

  res
    .status(StatusCodes.OK)
    .json({ nHits: tempFiles.length, files: tempFiles });
};

export const getSingleFile = async (req, res) => {
  const {
    user: { userId },
    params: { id: fileId },
  } = req;

  const file = await File.findOne({ _id: fileId, user: userId });

  if (!file) {
    throw new CustomError.NotFoundError("File not found");
  }

  const url = await file.getUrl(S3Client, file.fileName);
  let tempFile = {
    _id: file._id,
    name: file.name,
    size: file.size,
    mimetype: file.mimetype,
    isFileShared: file.isFileShared,
    url,
  };

  res.status(StatusCodes.OK).json({ file: tempFile });
};

export const updateFile = async (req, res) => {
  res.status(StatusCodes.CREATED).json("update file file");
};

export const deleteFIle = async (req, res) => {
  const { id: fileId } = req.params;

  const file = await File.findOneAndDelete({
    _id: fileId,
    user: req.user.userId,
  });

  if (!file) {
    throw new CustomError.NotFoundError("File not found");
  }

  const deleteObjectParams = {
    Bucket: process.env.S3_BUCKET,
    Key: file.fileName,
  };

  const command = new DeleteObjectCommand(deleteObjectParams);
  await S3Client.send(command);

  await file.deleteOne({ _id: fileId });

  res.status(StatusCodes.OK).json({ msg: "File Deleted" });
};
