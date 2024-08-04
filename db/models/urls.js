"use strict";
import { DataTypes } from "sequelize";
import sequelize from "../../config/connectDb.js";

import Files from "./files.js";

const URL = sequelize.define(
  "Urls",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    urlId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    origUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    shortUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Files",
        key: "id",
      },
    },
    expireAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    modelName: "Urls",
    freezeTableName: true,
  }
);

URL.hasMany(URL, { foreignKey: "fileId" });
URL.belongsTo(Files, { foreignKey: "fileId" });

export default URL;
