"use strict";

module.exports = (sequelize, DataTypes) => {
    const PlotProperty = sequelize.define(
        "PlotProperty",
        {
            propertyId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "properties", key: "id" },
                onDelete: "CASCADE",
            },

            // Plot Category / Use Type
            plotCategory: {
                type: DataTypes.ENUM('residential', 'commercial', 'agricultural'),
                allowNull: false
            },

            // Plot Size
            plotArea: {
                type: DataTypes.STRING, // keeping as string to allow "100 sq. yards" or "900 sq. ft."
                allowNull: false
            },
            frontage: {
                type: DataTypes.FLOAT,
                allowNull: true
            },
            length: {
                type: DataTypes.FLOAT,
                allowNull: true
            },
            breadth: {
                type: DataTypes.FLOAT,
                allowNull: true
            },

            // Facing Direction
            facingDirection: {
                type: DataTypes.ENUM('north', 'east', 'west', 'south'),
                allowNull: true
            },

            price_negotiable: {
                type: DataTypes.ENUM('yes', 'no'),
                allowNull: true
            },
            ownershipType: {
                type: DataTypes.ENUM('freehold', 'leasehold', 'power-of-attorney'),
                allowNull: true
            },

            // Road Width
            roadWidth: {
                type: DataTypes.STRING,
                allowNull: true
            },

            // Nearby Amenities
            nearbyAmenities: {
                type: DataTypes.ARRAY(DataTypes.STRING), // stores selected amenities
                allowNull: true
            },

        },
        {
            tableName: "plot_properties",
            timestamps: true,
        }
    );

    PlotProperty.associate = function (models) {
        PlotProperty.belongsTo(models.Property, { foreignKey: "propertyId" });
    };

    return PlotProperty;
};
