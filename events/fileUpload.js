import eventEmitter from "./eventEmitter.js";
import { promises as fs } from "fs";
import { randomHash, S3Client } from "../utils/index.js";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import Files from "../db/models/files.js";

eventEmitter.on("fileCreated", async ({ file, userId }) => {
  const fileContent = await fs.readFile(file.tempFilePath);
  const fileName = randomHash();

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    Body: fileContent,
    ContentType: file.mimetype,
  });
  await S3Client.send(command);

  await Files.create({
    name: file.name,
    fileName,
    size: file.size,
    mimetype: file.mimetype,
    userId,
  });

  await fs.unlink(file.tempFilePath);
});

eventEmitter.on("fileDeleted", async ({ fileName }) => {
  const deleteObjectParams = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
  };

  const command = new DeleteObjectCommand(deleteObjectParams);
  await S3Client.send(command);
});
