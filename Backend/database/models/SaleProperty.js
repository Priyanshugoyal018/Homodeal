"use strict";

module.exports = (sequelize, DataTypes) => {
    const SaleProperty = sequelize.define(
        "SaleProperty",
        {
            propertyId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "properties", key: "id" },
                onDelete: "CASCADE",
            },

            propertyType: {
                type: DataTypes.ENUM(
                    'flat', 'independent-house', 'builder-floor', 'villa',
                    'shop', 'office', 'showroom', 'warehouse', 'commercial'
                ),
                allowNull: false
            },

            carpetArea: { type: DataTypes.FLOAT, allowNull: false },
            superBuiltUpArea: { type: DataTypes.FLOAT, allowNull: true },

            currentFloor: { type: DataTypes.STRING, allowNull: true },
            totalFloors: { type: DataTypes.STRING, allowNull: true },
            liftAvailable: { type: DataTypes.ENUM('yes', 'no'), allowNull: true },

            furnishingStatus: {
                type: DataTypes.ENUM('unfurnished', 'semi-furnished', 'fully-furnished'),
                allowNull: true
            },

            propertyAge: {
                type: DataTypes.ENUM('new', 'less-than-5-years', '5-10-years', 'more-than-10-years'),
                allowNull: true
            },

            washroomAvailable: { type: DataTypes.ENUM('yes', 'no'), allowNull: true },
            washroomType: { type: DataTypes.ENUM('attached', 'common'), allowNull: true },

            parkingAvailable: { type: DataTypes.ENUM('yes', 'no'), allowNull: true },
            parkingType: { type: DataTypes.ENUM('dedicated', 'shared'), allowNull: true },

            roadFacing: { type: DataTypes.ENUM('yes', 'no'), allowNull: true },
            roadWidth: { type: DataTypes.STRING, allowNull: true },


            negotiable: { type: DataTypes.ENUM('yes', 'no'), allowNull: true },

            ownershipType: {
                type: DataTypes.ENUM('freehold', 'leasehold', 'power-of-attorney'),
                allowNull: true
            },
            nearbyLandmarks: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: true
            },
        },
        {
            tableName: "sale_properties",
            timestamps: true,
        }
    );

    SaleProperty.associate = function (models) {
        SaleProperty.belongsTo(models.Property, { foreignKey: "propertyId" });
    };

    return SaleProperty;
};
