"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("properties", "name", {
      type: Sequelize.STRING,
      allowNull: true, // optional field
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("properties", "name");
  },
};
