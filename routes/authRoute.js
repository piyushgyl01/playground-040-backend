const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/authenticateToken");

//register
router.post("/register", authController.registerUser);

//login
router.post("/login", authController.loginUser);

//logout
router.post("/logout", authController.logoutUser);

//get user
router.get("/user", authenticateToken, authController.getUserDetails);

//refresh token
router.post("/refresh-token", authController.refreshAuthToken);

module.exports = router;
