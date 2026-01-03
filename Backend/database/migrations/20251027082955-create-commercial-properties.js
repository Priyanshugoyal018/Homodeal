"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("commercial_properties", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      propertyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "properties",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      propertyType: {
        type: Sequelize.ENUM("shop", "office", "showroom", "warehouse", "commercial"),
        allowNull: false,
      },

      carpetArea: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      superBuiltUpArea: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      currentFloor: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      totalFloors: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      liftAvailable: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
      },

      furnishingStatus: {
        type: Sequelize.ENUM("unfurnished", "semi-furnished", "fully-furnished"),
        allowNull: true,
      },

      propertyAge: {
        type: Sequelize.ENUM("new", "less-than-5-years", "5-10-years", "more-than-10-years"),
        allowNull: true,
      },

      washroomAvailable: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
      },
      washroomType: {
        type: Sequelize.ENUM("attached", "common"),
        allowNull: true,
      },

      parkingAvailable: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
      },
      parkingType: {
        type: Sequelize.ENUM("dedicated", "shared"),
        allowNull: true,
      },

      roadFacing: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
      },
      roadWidth: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      nearbyLandmarks: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
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
    await queryInterface.dropTable("commercial_properties");

    // Drop ENUMs explicitly to avoid leftover Postgres enum types
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_commercial_properties_propertyType";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_commercial_properties_liftAvailable";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_commercial_properties_furnishingStatus";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_commercial_properties_propertyAge";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_commercial_properties_washroomAvailable";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_commercial_properties_washroomType";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_commercial_properties_parkingAvailable";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_commercial_properties_parkingType";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_commercial_properties_roadFacing";');
  },
};
