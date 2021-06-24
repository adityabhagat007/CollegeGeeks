const express = require("express")

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/Signup", authController.getSignupPage);

router.get("/login", authController.getLoginPage);

module.exports = router;