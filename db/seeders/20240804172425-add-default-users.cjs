"use strict";

const uuid = require("uuid").v4;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          id: uuid(),
          name: "ruby",
          email: "ruby@gmail.com",
          password:
            "$2a$10$bjbOtb4bU6uecDBYzh87CuzxFc5JeXKJQJAdyAYqIQ7vUthMggtHK", //Hash it before inserting don't forget !!!
          role: "admin",
          isVerified: true,
          storageLimit: process.env.USER_MAXSIZE,
          verified: new Date(Date.now()),
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
        },
        {
          id: uuid(),
          name: "peter",
          email: "peter@gmail.com",
          password:
            "$2a$10$bjbOtb4bU6uecDBYzh87CuzxFc5JeXKJQJAdyAYqIQ7vUthMggtHK", //Hash it before inserting don't forget !!!
          role: "user",
          isVerified: true,
          storageLimit: process.env.USER_MAXSIZE,
          verified: new Date(Date.now()),
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
