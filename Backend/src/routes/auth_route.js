const express = require("express");
const router = express.Router();
const {
  registerValidation,
  loginValidation,
} = require("../middlewares/validation_middleware");
const {
  loginUser,
  registerUser,
  refreshAccessToken,
  getCurrentUser,
  logout,
  googleLogin,
} = require("../controllers/auth_controller");
router.post("/signup", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.post("/google", googleLogin);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);
router.get("/me", getCurrentUser);
module.exports = router;