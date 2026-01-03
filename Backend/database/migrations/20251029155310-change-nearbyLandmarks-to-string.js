'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Remove the existing ARRAY column
    await queryInterface.removeColumn('sale_properties', 'nearbyLandmarks');

    // Step 2: Add it back as a STRING column
    await queryInterface.addColumn('sale_properties', 'nearbyLandmarks', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert: change back to ARRAY of strings
    await queryInterface.removeColumn('sale_properties', 'nearbyLandmarks');
    await queryInterface.addColumn('sale_properties', 'nearbyLandmarks', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });
  },
};
