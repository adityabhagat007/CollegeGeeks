const express = require("express");

const feedController = require("../controllers/feed");
const isAuth = require("../middleware/isAuth");
const loginStatus = require("../middleware/loginStatus");
const newQuestionValidator = require("../middleware/validators/newQuestion");

const router = express.Router();

router.get("/", loginStatus, feedController.getLandingPage);

router.get("/about", loginStatus, feedController.getAboutPage);

router.get("/home", isAuth, feedController.getHomePage);

router.get("/myaccount", isAuth, feedController.getMyAccount);

router.get("/questionPage", isAuth, feedController.getQuestionPage);

router.post(
  "/askquestion",
  isAuth,
  newQuestionValidator,
  feedController.postAskQuestion
);

module.exports = router;
