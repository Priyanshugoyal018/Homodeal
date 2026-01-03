"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Use a transaction to ensure all steps succeed or fail together
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // 1. Add a new temporary column to hold the string data
      await queryInterface.addColumn(
        "commercial_properties",
        "nearbyLandmarks_new",
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction }
      );

      // 2. Convert the array to a string and populate the new column
      // This uses the PostgreSQL function 'array_to_string'
      await queryInterface.sequelize.query(
        'UPDATE "commercial_properties" SET "nearbyLandmarks_new" = array_to_string("nearbyLandmarks", \', \')',
        { transaction }
      );

      // 3. Remove the old array column
      await queryInterface.removeColumn(
        "commercial_properties",
        "nearbyLandmarks",
        { transaction }
      );

      // 4. Rename the new column to the original name
      await queryInterface.renameColumn(
        "commercial_properties",
        "nearbyLandmarks_new",
        "nearbyLandmarks",
        { transaction }
      );

      // Commit the transaction
      await transaction.commit();
    } catch (err) {
      // Roll back the transaction in case of any error
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    // Reverses the 'up' method
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // 1. Add a temporary column for the array
      await queryInterface.addColumn(
        "commercial_properties",
        "nearbyLandmarks_old",
        {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: true,
        },
        { transaction }
      );

      // 2. Convert the string back to an array
      // This uses the PostgreSQL function 'string_to_array'
      await queryInterface.sequelize.query(
        'UPDATE "commercial_properties" SET "nearbyLandmarks_old" = string_to_array("nearbyLandmarks", \', \')',
        { transaction }
      );

      // 3. Remove the new string column
      await queryInterface.removeColumn(
        "commercial_properties",
        "nearbyLandmarks",
        { transaction }
      );

      // 4. Rename the old column back
      await queryInterface.renameColumn(
        "commercial_properties",
        "nearbyLandmarks_old",
        "nearbyLandmarks",
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};