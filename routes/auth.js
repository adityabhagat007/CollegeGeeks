const express = require("express");

const signupValidator = require("../middleware/validators/signup");

const User = require("../models/user");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/Signup", authController.getSignupPage);

router.post("/signup", signupValidator, authController.postSignup);

router.get("/auth/:token", authController.verifyToken);

router.get("/login", authController.getLoginPage);

router.post("/login", authController.postLogin);

module.exports = router;
