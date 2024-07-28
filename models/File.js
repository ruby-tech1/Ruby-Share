import mongoose from "mongoose";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import CustomError from "../errors/index.js";

const FileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    fileName: {
      type: String,
      required: true,
    },
    // url: {
    //   type: String,
    //   required: true,
    // },
    size: {
      type: Number,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    isFileShared: {
      type: Boolean,
      default: false,
    },
    sharedUsers: {
      type: [mongoose.Types.ObjectId],
      default: null,
    },
  },
  { timestamps: true }
);

FileSchema.pre("save", async function () {
  const user = await this.model("User").findOne({ _id: this.user });

  if (user.storageUsed + this.size > process.env.USER_MAXSIZE) {
    throw new CustomError.BadRequestError("Storage limit exceeded");
  }
  user.storageUsed = user.storageUsed + this.size;
  await user.save();
});

FileSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    const user = await this.model("User").findOne({ _id: this.user });

    user.storageUsed = user.storageUsed - this.size;
    await user.save();
  }
);

FileSchema.methods.getUrl = async function (S3Client, fileName) {
  const getObjectParams = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
  };
  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(S3Client, command, {
    expiresIn: process.env.FILE_EXPIRE,
  });
  //   console.log(url);
  return url;
};

export default mongoose.model("File", FileSchema);
