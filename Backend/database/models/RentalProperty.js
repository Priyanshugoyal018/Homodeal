"use strict";

module.exports = (sequelize, DataTypes) => {
    const RentalProperty = sequelize.define(
        "RentalProperty",
        {
            propertyId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "properties", key: "id" },
                onDelete: "CASCADE",
            },

            // Property Type
            propertyType: {
                type: DataTypes.ENUM('room', '1bhk', '2bhk', '3bhk', 'independent', 'other'),
                allowNull: false
            },
            customType: {
                type: DataTypes.STRING,
                allowNull: true
            },

            // Suitable For
            suitableFor: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: true
            },

            // Furnishing Status
            furnishingStatus: {
                type: DataTypes.ENUM('furnished', 'semi-furnished', 'unfurnished'),
                allowNull: true
            },

            // Kitchen
            kitchenAvailable: {
                type: DataTypes.ENUM('yes', 'no'),
                allowNull: true
            },
            kitchenType: {
                type: DataTypes.ENUM('attached', 'shared'),
                allowNull: true
            },

            // Washroom
            washroomType: {
                type: DataTypes.ENUM('attached', 'shared'),
                allowNull: true
            },

            // Capacity
            capacity: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            // Additional Facilities
            facilities: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: true
            },

        },
        {
            tableName: "rental_properties",
            timestamps: true,
        }
    );

    RentalProperty.associate = function (models) {
        RentalProperty.belongsTo(models.Property, { foreignKey: "propertyId" });
    };

    return RentalProperty;
};
