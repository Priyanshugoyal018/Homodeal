'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('properties', 'mobile', {
      type: Sequelize.STRING,
      allowNull: true // Keeping nullable for existing records, enforced in app
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('properties', 'mobile');
  }
};
