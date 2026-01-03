"use strict";

module.exports = (sequelize, DataTypes) => {
  const Property = sequelize.define(
    "Property",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      property_purpose: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "auth_users",
          key: "user_id",
        },
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
        validate: {
          isIn: [['pending', 'approved', 'cancelled']],
        },
      },
    },
    {
      tableName: "properties",
      timestamps: true,
    }
  );

  Property.associate = function (models) {
    Property.hasOne(models.CommercialProperty, { foreignKey: "propertyId" })
    Property.hasOne(models.RentalProperty, { foreignKey: "propertyId" })
    Property.hasOne(models.SaleProperty, { foreignKey: "propertyId" });
    Property.hasOne(models.PlotProperty, { foreignKey: "propertyId" });
    Property.belongsTo(models.AuthUser, { foreignKey: "userId", as: "owner" });
    Property.hasMany(models.Interest, { foreignKey: "propertyId", as: "interests" });
  };

  return Property;
};