"use strict";
import sequelize from "../../config/connectDb.js";
import { DataTypes } from "sequelize";
import Users from "./user.js";

const Activities = sequelize.define(
  "Activities",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    propertyId: {
      type: DataTypes.UUID,
    },
    activityType: {
      type: DataTypes.ENUM,
      values: [
        "created file",
        "update file",
        "deleted file",
        "get file",
        "get files",
        "get user",
        "get users",
        "updated user",
        "created user",
        "login",
        "logout",
        "updated password",
        "get activity",
        "get activities",
      ],
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
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
    modelName: "Activities",
    freezeTableName: true,
    paranoid: true,
  }
);

Activities.hasMany(Activities, { foreignKey: "userId" });
Activities.belongsTo(Users, { foreignKey: "userId" });

export default Activities;
