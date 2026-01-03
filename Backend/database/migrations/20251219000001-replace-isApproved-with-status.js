'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Remove isApproved column
        await queryInterface.removeColumn('properties', 'isApproved');

        // Add status column
        await queryInterface.addColumn('properties', 'status', {
            type: Sequelize.ENUM('pending', 'approved', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending',
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Remove status column
        await queryInterface.removeColumn('properties', 'status');

        // Add isApproved column back
        await queryInterface.addColumn('properties', 'isApproved', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        });
    }
};
