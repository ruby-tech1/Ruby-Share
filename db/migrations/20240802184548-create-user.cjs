"use strict";
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
      },
      role: {
        type: Sequelize.ENUM,
        values: ["admin", "user"],
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notNull: { msg: "Email is required" },
          notEmpty: { msg: "Email cannot be empty." },
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "name is required" },
          notEmpty: { msg: "name cannot be empty." },
        },
      },
      storageUsed: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      storageLimit: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      verificationCode: {
        type: Sequelize.STRING,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      verified: {
        type: Sequelize.DATE,
      },
      passwordToken: {
        type: Sequelize.STRING,
      },
      passwordTokenExpirationDate: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable("Tokens", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      refreshToken: {
        type: Sequelize.STRING,
      },
      ip: {
        type: Sequelize.STRING,
      },
      userAgent: {
        type: Sequelize.STRING,
      },
      isValid: {
        defaultValue: true,
        type: Sequelize.BOOLEAN,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.createTable("Files", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
        allowNull: false,
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      mimetype: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      isFileShared: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      sharedUsers: {
        type: Sequelize.ARRAY(Sequelize.UUID),
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
        type: Sequelize.DATE,
        defaultValue: Date.now(),
      },
      clicks: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.createTable("Urls", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      urlId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      origUrl: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
      shortUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fileId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Files",
          key: "id",
        },
      },
      expireAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Urls");
    await queryInterface.dropTable("Files");
    await queryInterface.dropTable("Tokens");
    await queryInterface.dropTable("Users");
  },
};
