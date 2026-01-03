"use strict";

module.exports = (sequelize, DataTypes) => {
    const Interest = sequelize.define(
        "Interest",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            propertyId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "properties",
                    key: "id",
                },
            },
        },
        {
            tableName: "interests",
            timestamps: true,
        }
    );

    Interest.associate = function (models) {
        Interest.belongsTo(models.Property, { foreignKey: "propertyId", as: "property" });
    };

    return Interest;
};
