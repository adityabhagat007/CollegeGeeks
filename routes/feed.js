const express = require("express");

const feedController = require("../controllers/feed");
const isAuth = require("../middleware/isAuth");
const isAuthAPI = require("../middleware/isAuthAPI");
const loginStatus = require("../middleware/loginStatus");
const newQuestionValidator = require("../middleware/validators/newQuestion");
const getHomePageValidator = require("../middleware/validators/getHome");
const getQuestionsValidator = require("../middleware/validators/getQuestions");

const router = express.Router();

router.get("/", loginStatus, feedController.getLandingPage);

router.get("/about", loginStatus, feedController.getAboutPage);

router.get("/home", isAuth, getHomePageValidator, feedController.getHomePage);

router.get("/myaccount", isAuth, feedController.getProfile);

router.get("/questionPage", isAuth, feedController.getQuestion);

router.get("/userActivity", isAuth, feedController.getActivity);

router.get("/PublicProfile", isAuth, feedController.getPublicProfile);

router.get("/Editprofile", isAuth, feedController.getEditprofile);

router.get(
  "/questions",
  loginStatus,
  getQuestionsValidator,
  feedController.getQuestions
);

//router.get("/questions/details", feedController.getQuestion);

router.get("/follow", isAuthAPI, feedController.follow);

router.post(
  "/askquestion",
  isAuth,
  newQuestionValidator,
  feedController.postAskQuestion
);

router.post("/newanswer", isAuth, feedController.postNewAnswer);

module.exports = router;
