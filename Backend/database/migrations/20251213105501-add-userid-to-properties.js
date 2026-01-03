'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('properties', 'userId', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'auth_users',
                key: 'user_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('properties', 'userId');
    }
};
