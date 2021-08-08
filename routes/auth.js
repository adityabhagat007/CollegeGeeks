const express = require("express");

const signupValidator = require("../middleware/validators/signup");
const authController = require("../controllers/auth");
const loginStatus = require("../middleware/loginStatus");
const isAuth = require("../middleware/isAuth");
const changePasswordValidator = require("../middleware/validators/changePassword");

const router = express.Router();

router.get("/Signup", loginStatus, authController.getSignupPage);

router.post("/signup", signupValidator, authController.postSignup);

router.get("/auth/:token", authController.verifyToken);

router.get("/login", loginStatus, authController.getLoginPage);

router.post("/login", authController.postLogin);

router.get("/logout", isAuth, authController.logout);

router.post(
  "/changepassword",
  isAuth,
  changePasswordValidator,
  authController.postChangePassword
);

module.exports = router;
