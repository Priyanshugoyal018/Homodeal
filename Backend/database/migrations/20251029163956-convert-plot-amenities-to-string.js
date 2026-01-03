"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // We use a transaction to ensure all steps succeed or fail together
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // 1. Add a new temporary column 'nearbyAmenities_new' of type STRING
      await queryInterface.addColumn(
        "plot_properties", // Make sure this table name matches your model
        "nearbyAmenities_new",
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction }
      );

      // 2. Convert the array data to a string (joined by ', ') and populate the new column
      // This uses the PostgreSQL function 'array_to_string'
      await queryInterface.sequelize.query(
        'UPDATE "plot_properties" SET "nearbyAmenities_new" = array_to_string("nearbyAmenities", \', \')',
        { transaction }
      );

      // 3. Remove the old 'nearbyAmenities' ARRAY column
      await queryInterface.removeColumn(
        "plot_properties",
        "nearbyAmenities",
        { transaction }
      );

      // 4. Rename the new column to the original name 'nearbyAmenities'
      await queryInterface.renameColumn(
        "plot_properties",
        "nearbyAmenities_new",
        "nearbyAmenities",
        { transaction }
      );

      // If all steps succeeded, commit the transaction
      await transaction.commit();
    } catch (err) {
      // If any step fails, roll back the entire transaction
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    // This reverses the 'up' method
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // 1. Add a temporary column 'nearbyAmenities_old' for the array
      await queryInterface.addColumn(
        "plot_properties",
        "nearbyAmenities_old",
        {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: true,
        },
        { transaction }
      );

      // 2. Convert the string back to an array
      // This uses the PostgreSQL function 'string_to_array'
      await queryInterface.sequelize.query(
        'UPDATE "plot_properties" SET "nearbyAmenities_old" = string_to_array("nearbyAmenities", \', \')',
        { transaction }
      );

      // 3. Remove the new string column 'nearbyAmenities'
      await queryInterface.removeColumn(
        "plot_properties",
        "nearbyAmenities",
        { transaction }
      );

      // 4. Rename the old column back
      await queryInterface.renameColumn(
        "plot_properties",
        "nearbyAmenities_old",
        "nearbyAmenities",
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};