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

exports.getUserActivity = (req, res, next) => {
  res.render("userActivity");
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

exports.getQuestions = async (req, res, next) => {
  try {
    //pulling data out from req
    const page = req.query.page - 1; // - 1 to keep the pagination logic clean
    const category = req.query.category;
    //Fiding requested questions
    const questions = await Question.find({ category })
      .skip(page * 10)
      .limit(10);
    if (!questions) {
      req.flash("error", "Can not find any questions");
      return res.redirect("/home");
    }
    //If we get questions
    res.render("/home", { questions });
  } catch (err) {
    next(err);
  }
};
