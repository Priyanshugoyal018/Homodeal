'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sale_properties', 'price');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sale_properties', 'price', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  }
};
