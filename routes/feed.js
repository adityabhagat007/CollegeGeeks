const express = require("express");

const feedController = require("../controllers/feed");

const router = express.Router();

router.get("/", feedController.getLandingPage);

router.get("/about", feedController.getAboutPage);

router.get("/home", feedController.getHomePage);

router.get("/myaccount", feedController.getMyAccount);

module.exports = router;