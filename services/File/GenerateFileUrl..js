import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client } from "../../utils/index.js";

const generateFileURL = async ({ fileName }) => {
  const getObjectParams = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
  };
  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(S3Client, command, {
    expiresIn: process.env.FILE_EXPIRE,
  });
  return url;
};

export default generateFileURL;
