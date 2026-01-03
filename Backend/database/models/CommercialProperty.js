"use strict";

module.exports = (sequelize, DataTypes) => {
  const CommercialProperty = sequelize.define(
    "CommercialProperty",
    {
      propertyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "properties", key: "id" },
        onDelete: "CASCADE",
      },
      // Property Type
      propertyType: {
        type: DataTypes.ENUM('shop', 'office', 'showroom', 'warehouse', 'commercial'),
        allowNull: false
      },

      // Area
      carpetArea: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      superBuiltUpArea: {
        type: DataTypes.FLOAT,
        allowNull: true
      },

      // Floor Details
      currentFloor: {
        type: DataTypes.STRING,
        allowNull: true
      },
      totalFloors: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      liftAvailable: {
        type: DataTypes.ENUM('yes', 'no'),
        allowNull: true
      },

      // Furnishing
      furnishingStatus: {
        type: DataTypes.ENUM('unfurnished', 'semi-furnished', 'fully-furnished'),
        allowNull: true
      },

      // Age
      propertyAge: {
        type: DataTypes.ENUM('new', 'less-than-5-years', '5-10-years', 'more-than-10-years'),
        allowNull: true
      },

      // Washroom
      washroomAvailable: {
        type: DataTypes.ENUM('yes', 'no'),
        allowNull: true
      },
      washroomType: {
        type: DataTypes.ENUM('attached', 'common'),
        allowNull: true
      },

      // Parking
      parkingAvailable: {
        type: DataTypes.ENUM('yes', 'no'),
        allowNull: true
      },
      parkingType: {
        type: DataTypes.ENUM('dedicated', 'shared'),
        allowNull: true
      },

      // Road Facing
      roadFacing: {
        type: DataTypes.ENUM('yes', 'no'),
        allowNull: true
      },
      roadWidth: {
        type: DataTypes.STRING,
        allowNull: true
      },

      nearbyLandmarks: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
      },

      // Pricing & Ownership
      negotiable: {
        type: DataTypes.ENUM('yes', 'no'),
        allowNull: true
      },
      ownershipType: {
        type: DataTypes.ENUM('freehold', 'leasehold', 'power-of-attorney'),
        allowNull: true
      }

    },
    {
      tableName: "commercial_properties",
      timestamps: true,
    }
  );

  CommercialProperty.associate = function (models) {
    CommercialProperty.belongsTo(models.Property, { foreignKey: "propertyId" });
  };

  return CommercialProperty;
};
