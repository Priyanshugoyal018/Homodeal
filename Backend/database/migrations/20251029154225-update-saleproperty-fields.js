'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add new columns
    await queryInterface.addColumn('sale_properties', 'carpetArea', {
      type: Sequelize.FLOAT,
      allowNull: false,
    });

    await queryInterface.addColumn('sale_properties', 'superBuiltUpArea', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.addColumn('sale_properties', 'washroomAvailable', {
      type: Sequelize.ENUM('yes', 'no'),
      allowNull: true,
    });

    await queryInterface.addColumn('sale_properties', 'washroomType', {
      type: Sequelize.ENUM('attached', 'common'),
      allowNull: true,
    });

    await queryInterface.addColumn('sale_properties', 'parkingAvailable', {
      type: Sequelize.ENUM('yes', 'no'),
      allowNull: true,
    });

    await queryInterface.addColumn('sale_properties', 'parkingType', {
      type: Sequelize.ENUM('dedicated', 'shared'),
      allowNull: true,
    });

    await queryInterface.addColumn('sale_properties', 'roadFacing', {
      type: Sequelize.ENUM('yes', 'no'),
      allowNull: true,
    });

    await queryInterface.addColumn('sale_properties', 'roadWidth', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('sale_properties', 'price', {
      type: Sequelize.FLOAT,
      allowNull: false,
    });

    await queryInterface.addColumn('sale_properties', 'ownershipType', {
      type: Sequelize.ENUM('freehold', 'leasehold', 'power-of-attorney'),
      allowNull: true,
    });

    await queryInterface.addColumn('sale_properties', 'nearbyLandmarks', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });

    // Update ENUM for propertyType
    await queryInterface.changeColumn('sale_properties', 'propertyType', {
      type: Sequelize.ENUM(
        'flat',
        'independent-house',
        'builder-floor',
        'villa',
        'shop',
        'office',
        'showroom',
        'warehouse',
        'commercial'
      ),
      allowNull: false,
    });

    // Remove the old 'washrooms' column (optional)
    await queryInterface.removeColumn('sale_properties', 'washrooms');
  },

  async down(queryInterface, Sequelize) {
    // Revert the changes

    await queryInterface.removeColumn('sale_properties', 'carpetArea');
    await queryInterface.removeColumn('sale_properties', 'superBuiltUpArea');
    await queryInterface.removeColumn('sale_properties', 'washroomAvailable');
    await queryInterface.removeColumn('sale_properties', 'washroomType');
    await queryInterface.removeColumn('sale_properties', 'parkingAvailable');
    await queryInterface.removeColumn('sale_properties', 'parkingType');
    await queryInterface.removeColumn('sale_properties', 'roadFacing');
    await queryInterface.removeColumn('sale_properties', 'roadWidth');
    await queryInterface.removeColumn('sale_properties', 'price');
    await queryInterface.removeColumn('sale_properties', 'ownershipType');
    await queryInterface.removeColumn('sale_properties', 'nearbyLandmarks');

    // Revert ENUM back to old version
    await queryInterface.changeColumn('sale_properties', 'propertyType', {
      type: Sequelize.ENUM('flat', 'independent-house', 'builder-floor', 'villa'),
      allowNull: false,
    });

    // Re-add the washrooms column
    await queryInterface.addColumn('sale_properties', 'washrooms', {
      type: Sequelize.ENUM('1', '2', '3', '4+'),
      allowNull: true,
    });
  },
};
