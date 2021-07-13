const User = require("../models/user");
const Question = require("../models/question");

exports.getLandingPage = (req, res, next) => {
  res.render("index", { isLoggedIn: req.loginStatus });
};

exports.getAboutPage = (req, res, next) => {
  res.render("aboutus", { isLoggedIn: req.loginStatus });
};

exports.getHomePage = (req, res, next) => {
  res.render("home");
};

exports.getMyAccount = (req, res, next) => {
  res.render("myaccount");
};

exports.getQuestionPage = (req, res, next) => {
  res.render("questionPage");
};

exports.postAskQuestion = async (req, res, next) => {
  try {
    //Pulling the data out from request body
    const statement = req.body.statement;
    const category = req.body.category;
    //Getting the user data
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    //Creating a new question doc
    const newQuestion = new Question({
      author: user._id,
      authorName: user.name,
      statement: req.body.statement,
      category: req.body.category,
    });

    const question = await newQuestion.save();
    //If everything goes alright
    res.redirect("/home");
  } catch (err) {
    next(err);
  }
};
