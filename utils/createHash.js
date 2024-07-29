import crypto from "crypto";

export const createHash = (string) => {
  return crypto.createHash("md5").update(string).digest("hex");
};

export const randomHash = () => crypto.randomBytes(20).toString("hex");
