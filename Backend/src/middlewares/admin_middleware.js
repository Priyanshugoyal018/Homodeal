const db = require("../../database/models");

const isAdmin = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await db.AuthUser.findByPk(userId);

        if (!user || !user.isAdmin) {
            return res.status(403).json({
                message: "Access denied. Admin privileges required.",
            });
        }
        
        next();
    } catch (error) {
        console.error("Admin middleware error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = isAdmin;
