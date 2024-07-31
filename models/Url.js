import mongoose from "mongoose";
import validator from "validator";

const validatorOptions = {
  protocols: ["http", "https", "ftp"],
  require_tld: true,
  require_protocol: true,
  require_host: true,
  require_valid_protocol: true,
  allow_underscores: false,
  host_whitelist: false,
  host_blacklist: false,
  allow_trailing_dot: false,
  allow_protocol_relative_urls: false,
  disallow_auth: false,
};

const UrlSchema = new mongoose.Schema(
  {
    urlId: {
      type: String,
      required: true,
      unique: true,
    },
    origUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (url) => validator.isURL(url, validatorOptions),
        message: "Please provide a valid url",
      },
    },
    shortUrl: {
      type: String,
      required: true,
      trim: true,
    },
    file: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Url", UrlSchema);
