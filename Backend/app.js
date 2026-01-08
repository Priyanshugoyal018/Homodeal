require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// ----------------------------------------- Middlewares -------------------------------------
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:8080", // Frontend URL
    credentials: true,
  })
);
app.use(cookieParser());

// ----------------------------------------- Database Setup ----------------------------------
// const db = require("./database/models");
// db.sequelize
//   .authenticate()
//   .then(() => console.log("✅ Database connected"))
//   .catch((err) => console.error("❌ Database connection failed:", err));
const db = require("./database/models");

db.sequelize
  .authenticate()
  .then(async () => {
    console.log("✅ Database connected");

    await db.sequelize.sync({ alter: true }); // 👈 IMPORTANT
    console.log("✅ Tables synced successfully");
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });


// ----------------------------------------- Routes ------------------------------------------
const authRoutes = require("./src/routes/auth_route");
const propertyRoutes = require("./src/routes/property_route");

app.use("/api/auth", authRoutes);
app.use("/api/property", propertyRoutes);

// ----------------------------------------- Server ------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
