"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.removeColumn("auth_users", "email_verified");
    } catch (e) {
      console.log("Column email_verified might not exist, skipping removal.");
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("auth_users", "email_verified", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },
};
