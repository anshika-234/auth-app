const express = require("express");
const router = express.Router();
const authController = require("./../Controllers/AuthController.js");
const { protect } = require("./../Middlewares/middleware.js");

router.route("/signup").post(authController.Signup);
router.route("/login").post(authController.Login);
router.post("/logout", protect, authController.logout);
router.post("/forget-password", authController.forgotPassword);
router.patch("/reset-password/:token", authController.resetPassword);
router.route("/me").get(protect, authController.me);

module.exports = router;
