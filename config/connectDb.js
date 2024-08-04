import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const env = process.env.NODE_ENV || "development";
import config from "./config.js";

const sequelize = new Sequelize(process.env.DB_URL, config[env]);

export default sequelize;
