'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('auth_users');

    // 1. Make password nullable
    if (tableInfo.password) {
      await queryInterface.changeColumn('auth_users', 'password', {
        type: Sequelize.STRING,
        allowNull: true, 
      });
    }

    // 2. Add googleId column
    if (!tableInfo.googleId) {
      await queryInterface.addColumn('auth_users', 'googleId', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      });
    }

    // 3. Add avatar column
    if (!tableInfo.avatar) {
      await queryInterface.addColumn('auth_users', 'avatar', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Revert changes
    // Note: We can't easily revert "nullable" to "not null" without data loss risks if nulls exist.
    // So we primarily revert the added columns.
    
    await queryInterface.removeColumn('auth_users', 'googleId');
    await queryInterface.removeColumn('auth_users', 'avatar');
    // Optionally try to revert password to not null if you are sure:
    // await queryInterface.changeColumn('auth_users', 'password', { type: Sequelize.STRING, allowNull: false });
  }
};
