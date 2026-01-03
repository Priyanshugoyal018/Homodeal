"use strict";

module.exports = (sequelize, DataTypes) => {
  const AuthUser = sequelize.define(
    "AuthUser",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "auth_users",
      timestamps: true,
    }
  );

  AuthUser.associate = function (models) {
    AuthUser.hasMany(models.Property, { foreignKey: "userId", as: "properties" });
  };

  return AuthUser;
};
