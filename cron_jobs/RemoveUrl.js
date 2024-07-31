import Url from "../models/Url.js";

export const RemoveUrl = async () => {
  await Url.deleteMany({ expireAt: { $lt: new Date(Date.now()) } });

  console.log("Expires Urls deleted");
};
