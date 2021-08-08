const Answer = require("../models/answer");
const Question = require("../models/question");
const User = require("../models/user");

exports.getLandingPage = (req, res, next) => {
  res.render("index", { isLoggedIn: req.loginStatus });
};

exports.getAboutPage = (req, res, next) => {
  res.render("aboutus", { isLoggedIn: req.loginStatus });
};

exports.getHomePage = async (req, res, next) => {
  try {
    //pulling data out from req
    const page = req.query.page || 1; //Default 1
    const category = req.session.user.branch.toLowerCase();
    //Calculating total number of pages
    const totalQuestions = await Question.countDocuments({ category });
    const totalPages = Math.ceil(totalQuestions / 10);
    //Finding requested questions
    const questions = await Question.find({ category })
      .skip((page - 1) * 10)
      .limit(10);
    if (!questions) {
      return res.render("home", { error: "Can not find any questions" });
    }
    //If we get questions
    res.render("home", { questions, error: "", totalPages, currentPage: page });
  } catch (err) {
    next(err);
  }
};

exports.getMyAccount = (req, res, next) => {
  res.render("myaccount");
};

exports.getUserActivity = (req, res, next) => {
  res.render("userActivity");
};

exports.getPublicProfile = (req, res, next) => {
  res.render("PublicProfile");
};

exports.getEditprofile = (req, res, next) => {
  res.render("Editprofile");
};

exports.getForgetPassword = (req, res, next) => {
  res.render("forgetPassword");
};

exports.postAskQuestion = async (req, res, next) => {
  try {
    //Pulling the data out from request body
    const statement = req.body.statement;
    const category = req.body.category.toLowerCase();
    //Getting the user data
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    //Creating a new question doc
    const newQuestion = new Question({
      author: user._id,
      authorName: user.name,
      statement: statement,
      category: category,
    });

    const question = await newQuestion.save();
    //Connecting the question with the author
    const questions = user.questions;
    questions.push(question._id);
    user.questions = questions;
    const updatedUser = await user.save();
    //If everything goes alright
    res.redirect("/home");
  } catch (err) {
    next(err);
  }
};

exports.getQuestions = async (req, res, next) => {
  try {
    //pulling data out from req
    const page = req.query.page || 1; //Default 1
    const category = req.query.category || req.session.user.category || "cse";
    //Finding total number of pages
    const totalQuestions = await Question.countDocuments({ category });
    const totalPages = Math.ceil(totalQuestions / 10);
    //Finding requested questions
    const questions = await Question.find({ category })
      .skip((page - 1) * 10)
      .limit(10);
    if (!questions) {
      return res.render("questions", {
        error: "Can not find any questions",
        isLoggedIn: req.loginStatus,
      });
    }
    //If we get questions
    res.render("questions", {
      questions,
      totalPages,
      currentPage: page,
      error: "",
      isLoggedIn: req.loginStatus,
    });
  } catch (err) {
    next(err);
  }
};

exports.getQuestion = async (req, res, next) => {
  console.log(req.body);
  try {
    const questionId = req.query.questionId;
    if (questionId === undefined || questionId.length !== 24) {
      return res.render("questionPage", {
        error: "Please attach a valid question id!",
      });
    }
    //If an id is found
    const question = await Question.findById(questionId).populate("answers");
    if (!question) {
      return res.render("questionPage", {
        error: "Sorry! this question can not be found.",
      });
    }
    //If we get a question
    res.render("questionPage", { question, error: req.flash("error") });
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.session.user._id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.render("myaccount", { error: "No user is found!" });
    }
    //console.log(user);
    const profile = {
      ...user._doc,
      questions: user.questions.length,
      followers: user.followers.length,
      likedQuestions: user.likedQuestions.length,
      likedAnswers: user.likedAnswers.length,
      answers: user.answers.length,
      followings: user.followings.length,
      answeredQuestions: user.answeredQuestions.length,
    };
    res.render("myaccount", { profile, error: req.flash("error") });
  } catch (err) {
    next(err);
  }
};

exports.getActivity = async (req, res, next) => {
  try {
    const userId = req.session.user._id;

    const activity = await User.findById(userId)
      .select("questions answeredQuestions")
      .populate({
        path: "questions answeredQuestions",
        select: "-answers",
      });

    if (!activity) {
      return res.render("userActivity", { error: "no activity found!" });
    }
    //If activity is found;
    console.log(activity);
    res.render("userActivity", { error: "", activity });
  } catch (err) {
    next(err);
  }
};

exports.postNewAnswer = async (req, res, next) => {
  try {
    const answerContent = req.body.answer;
    const questionId = req.body.questionId;
    const userId = req.session.user._id;
    //Validation of answer
    if (!answerContent || answerContent.length === 0) {
      req.flash("error", "Answer can not be empty!");
      return res.redirect(`/questionPage?questionId=${questionId}`);
    }

    //Getting the user and the question
    const user = await User.findById(userId);
    const question = await Question.findById(questionId);
    if (!user) {
      req.flash("error", "User not found!");
      return res.redirect(`/questionPage?questionId=${questionId}`);
    }
    if (!question) {
      req.flash("error", "Question not found!");
      return res.redirect(`/questionPage?questionId=${questionId}`);
    }
    //Creating a new answer doc
    const newAnswer = new Answer({
      author: user._id,
      authorName: user.name,
      content: answerContent,
      question: questionId,
    });

    const answer = await newAnswer.save();
    //connecting docs
    const updatedAnswers = question.answers;
    updatedAnswers.push(answer);
    question.answers = updatedAnswers;

    const updatedUserAnswers = user.answers;
    updatedUserAnswers.push(answer);
    user.answers = updatedUserAnswers;

    const updatedAnsweredQuestions = user.answeredQuestions;
    updatedAnsweredQuestions.push(questionId);
    user.answeredQuestions = updatedAnsweredQuestions;

    const updatedUser = await user.save();
    const updatedQuestion = await question.save();

    //If everything is successfull;
    res.redirect(`/questionPage?questionId=${questionId}`);
  } catch (err) {
    next(err);
  }
};
