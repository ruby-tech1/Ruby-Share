"use strict";

import sequelize from "../../config/connectDb.js";
import User from "../../db/models/user.js";
import { DataTypes } from "sequelize";

const Token = sequelize.define(
  "Tokens",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    refreshToken: {
      type: DataTypes.STRING,
    },
    ip: {
      type: DataTypes.STRING,
    },
    userAgent: {
      type: DataTypes.STRING,
    },
    isValid: {
      defaultValue: true,
      type: DataTypes.BOOLEAN,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
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
  { paranoid: true, freezeTableName: true, modelName: "Token" }
);

Token.hasMany(Token, { foreignKey: "userId" });
Token.belongsTo(User, { foreignKey: "userId" });

export default Token;
