const express = require("express");
const router = express.Router();
const { propertyValidation, interestValidation } = require("../middlewares/validation_middleware");
const {
  createProperty,
  getAllProperties,
  getPropertyById,
  getUserProperties,
  createInterest,
  getAdminProperties,
  updatePropertyStatus,
  deleteProperty,
  updateProperty
} = require("../controllers/property_controller");

const { storage } = require("../../cloudinary/initialization");
const multer = require('multer')
const upload = multer({ storage });
const authenticateUser = require("../middlewares/auth_middleware");

const isAdmin = require("../middlewares/admin_middleware");

// Property CRUD Routes
router.post("/create", authenticateUser, upload.array("images", 10), propertyValidation, createProperty);
router.post("/interest", interestValidation, createInterest);
router.get("/user/properties", authenticateUser, getUserProperties);
router.get("/all", getAllProperties);
router.get("/:id", getPropertyById);
router.delete("/:id", authenticateUser, deleteProperty);
router.patch("/:id", authenticateUser, upload.array("images", 10), propertyValidation, updateProperty);

// Admin Routes
router.get("/admin/properties", authenticateUser, isAdmin, getAdminProperties);
router.put("/admin/status/:id", authenticateUser, isAdmin, updatePropertyStatus);

module.exports = router;