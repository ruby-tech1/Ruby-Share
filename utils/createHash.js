import crypto from "crypto";

const hashString = (string) => {
  return crypto.createHash("md5").update(string).digest("hex");
};

export const randomHash = () => crypto.randomBytes(20).toString("hex");

export default hashString;
