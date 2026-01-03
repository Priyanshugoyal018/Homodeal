"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("plot_properties", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      propertyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "properties", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      plotCategory: {
        type: Sequelize.ENUM("residential", "commercial", "agricultural"),
        allowNull: false,
      },

      plotArea: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      frontage: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      length: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      breadth: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      facingDirection: {
        type: Sequelize.ENUM("north", "east", "west", "south"),
        allowNull: true,
      },

      price_negotiable: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
      },

      ownershipType: {
        type: Sequelize.ENUM("freehold", "leasehold", "power-of-attorney"),
        allowNull: true,
      },

      roadWidth: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      nearbyAmenities: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop table first
    await queryInterface.dropTable("plot_properties");

    // For Postgres: remove enum types left behind by Sequelize
    // Enum type names follow the pattern: "enum_<table>_<column>"
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_plot_properties_plotCategory";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_plot_properties_facingDirection";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_plot_properties_price_negotiable";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_plot_properties_ownershipType";');
  },
};
