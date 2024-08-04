"use strict";

import sequelize from "../../config/connectDb.js";
import CustomError from "../../errors/index.js";

import { DataTypes } from "sequelize";

// import {v4 as uuid} from 'uuid'
import bcrypt from "bcryptjs";
import validatePassword from "../../utils/validatePassword.js";

const User = sequelize.define(
  "Users",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM,
      values: ["admin", "user"],
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "name is required" },
        notEmpty: { msg: "name cannot be empty." },
        len: {
          args: [3, 100],
          msg: "name must be between 3 and 100 characters",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notNull: { msg: "Email is required" },
        notEmpty: { msg: "Email cannot be empty." },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "name is required" },
        notEmpty: { msg: "name cannot be empty." },
      },
    },
    storageUsed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    storageLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    verificationCode: {
      type: DataTypes.STRING,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verified: {
      type: DataTypes.DATE,
    },
    passwordToken: {
      type: DataTypes.STRING,
    },
    passwordTokenExpirationDate: {
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
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: "Users",
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          // Validating Password
          const valid = validatePassword(user.password);
          if (!valid) {
            throw new CustomError.BadRequestError("Password is not valid");
          }

          // Hashing Password
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (!user.changed("password")) return;

        // Validating Password
        const valid = validatePassword(user.password);
        if (!valid) {
          throw new CustomError.BadRequestError("Password is not valid");
        }

        // Hashing Password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
    },
  }
);

User.prototype.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

export default User;
