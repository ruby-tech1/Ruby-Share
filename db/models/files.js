"use strict";

import sequelize from "../../config/connectDb.js";
import { DataTypes } from "sequelize";

import Users from "../../db/models/user.js";
import CustomError from "../../errors/index.js";

const Files = sequelize.define(
  "Files",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "name is required" },
        notNull: { msg: "name cannot empty" },
        len: {
          args: [3, 255],
          msg: "name must between 3 and 225 characters",
        },
      },
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mimetype: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    isFileShared: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sharedUsers: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: [],
      validate: {
        duplicateArrayValueVAlidator(array) {
          const val = new Set(array).size === array.length;
          if (!val) {
            throw new CustomError.BadRequestError("user already exist");
          }
        },
      },
    },
    openedAt: {
      type: DataTypes.DATE,
      defaultValue: Date.now(),
    },
    clicks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
    modelName: "Files",
    freezeTableName: true,
    paranoid: true,
    hooks: {
      afterCreate: async function (file) {
        const user = await Users.findOne({ where: { id: file.userId } });

        if (user.storageUsed + file.size > user.storageLimit) {
          throw new CustomError.BadRequestError("Storage limit exceeded");
        }
        user.storageUsed = user.storageUsed + file.size;
        await user.save();
      },
      beforeDestroy: async function (file) {
        const user = await Users.findOne({ where: { _id: file.user } });

        user.storageUsed = user.storageUsed - file.size;
        await user.save();
      },
    },
  }
);

Files.hasMany(Files, { foreignKey: "userId" });
Files.belongsTo(Users, { foreignKey: "userId" });

export default Files;
