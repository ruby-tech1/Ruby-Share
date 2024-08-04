import Url from "../db//models/urls.js";
import { Op } from "sequelize";

export const RemoveUrl = async () => {
  await Url.destroy({ where: { expireAt: { [Op.lt]: new Date(Date.now()) } } });

  console.log("Expires Urls deleted");
};
