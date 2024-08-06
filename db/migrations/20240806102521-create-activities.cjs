"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Activities", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      propertyId: {
        type: Sequelize.UUID,
      },
      activityType: {
        type: Sequelize.ENUM,
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Activities");
  },
};
