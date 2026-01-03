"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sale_properties", {
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
        type: Sequelize.ENUM("flat", "independent-house", "builder-floor", "villa"),
        allowNull: false,
      },

      bhkType: {
        type: Sequelize.ENUM("1bhk", "2bhk", "3bhk", "4bhk", "5+bhk"),
        allowNull: true,
      },

      washrooms: {
        type: Sequelize.ENUM("1", "2", "3", "4+"),
        allowNull: true,
      },

      builtUpArea: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      currentFloor: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      totalFloors: {
        type: Sequelize.STRING,
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

      negotiable: {
        type: Sequelize.ENUM("yes", "no"),
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
    // Drop ENUMs first, then table
    await queryInterface.dropTable("sale_properties");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_sale_properties_propertyType";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_sale_properties_bhkType";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_sale_properties_washrooms";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_sale_properties_liftAvailable";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_sale_properties_furnishingStatus";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_sale_properties_propertyAge";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_sale_properties_negotiable";');
  },
};
