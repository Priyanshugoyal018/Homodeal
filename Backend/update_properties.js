const db = require("./database/models");

async function updateProperties() {
    try {
        await db.sequelize.authenticate();
        const [updated] = await db.Property.update(
            { userId: 6 },
            { where: { userId: null } }
        );
        console.log(`Updated ${updated} properties.`);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await db.sequelize.close();
    }
}

updateProperties();
