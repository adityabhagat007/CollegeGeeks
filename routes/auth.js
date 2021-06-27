const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/Signup", authController.getSignupPage);

router.post(
  "/signup",
  [
    body("email")
      .trim()
      .isEmail()
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("This email is already registered!");
          }
        });
      }),
    body("branch").notEmpty(),
    body("name").notEmpty(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password should be alphanumeric")
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password and confirm password not matched!!");
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.get("/auth/:token", authController.verifyToken);

router.get("/login", authController.getLoginPage);

router.post("/login", authController.postLogin);

module.exports = router;
