"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rental_properties", {
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

      propertyType: {
        type: Sequelize.ENUM("room", "1bhk", "2bhk", "3bhk", "independent", "other"),
        allowNull: false,
      },

      customType: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      suitableFor: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },

      furnishingStatus: {
        type: Sequelize.ENUM("furnished", "semi-furnished", "unfurnished"),
        allowNull: true,
      },

      kitchenAvailable: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
      },

      kitchenType: {
        type: Sequelize.ENUM("attached", "shared"),
        allowNull: true,
      },

      washroomType: {
        type: Sequelize.ENUM("attached", "shared"),
        allowNull: true,
      },

      capacity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      facilities: {
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
    await queryInterface.dropTable("rental_properties");

    // Drop ENUMs explicitly (Postgres keeps them globally)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_rental_properties_propertyType";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_rental_properties_furnishingStatus";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_rental_properties_kitchenAvailable";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_rental_properties_kitchenType";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_rental_properties_washroomType";'
    );
  },
};
