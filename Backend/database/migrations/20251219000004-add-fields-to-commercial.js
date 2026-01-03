'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        try {
            await queryInterface.addColumn('commercial_properties', 'negotiable', {
                type: Sequelize.ENUM('yes', 'no'),
                allowNull: true,
            });
        } catch (e) {
            console.log('Column negotiable already exists in commercial_properties');
        }

        try {
            await queryInterface.addColumn('commercial_properties', 'ownershipType', {
                type: Sequelize.ENUM('freehold', 'leasehold', 'power-of-attorney'),
                allowNull: true,
            });
        } catch (e) {
            console.log('Column ownershipType already exists in commercial_properties');
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('commercial_properties', 'negotiable');
        await queryInterface.removeColumn('commercial_properties', 'ownershipType');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_commercial_properties_negotiable";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_commercial_properties_ownershipType";');
    }
};
