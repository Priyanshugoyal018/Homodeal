'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        try {
            await queryInterface.addColumn('sale_properties', 'ownershipType', {
                type: Sequelize.ENUM('freehold', 'leasehold', 'power-of-attorney'),
                allowNull: true,
            });
        } catch (e) {
            console.log('Column ownershipType already exists in sale_properties');
        }

        try {
            await queryInterface.addColumn('sale_properties', 'nearbyLandmarks', {
                type: Sequelize.ARRAY(Sequelize.STRING),
                allowNull: true,
            });
        } catch (e) {
            console.log('Column nearbyLandmarks already exists in sale_properties');
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('sale_properties', 'ownershipType');
        await queryInterface.removeColumn('sale_properties', 'nearbyLandmarks');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_sale_properties_ownershipType";');
    }
};
