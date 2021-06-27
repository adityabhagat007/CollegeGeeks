const express = require("express");

const feedController = require("../controllers/feed");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/", feedController.getLandingPage);

router.get("/about", feedController.getAboutPage);

router.get("/home", isAuth, feedController.getHomePage);

router.get("/myaccount", isAuth, feedController.getMyAccount);

module.exports = router;
