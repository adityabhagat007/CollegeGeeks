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
    // console.log("line 15", req.flash("error"));
    // console.log("length ", req.flash("error").length);
    // console.log("type", typeof Array.from(req.flash("error")));
    // console.log(req.session.flash);
    // if (req.flash("error").length === 0) {
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
    res.render("home", {
      questions,
      error: req.flash("error"),
      totalPages,
      currentPage: page,
    });
    // } else {
    //   console.log("In else", req.flash("error"));
    //   res.render("home", { error: req.flash("error") });
    // }
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

// exports.getEditprofile = (req, res, next) => {
//   res.render("Editprofile");
// };

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

exports.getPublicProfile = async (req, res, next) => {
  try {
    const id = req.session.user._id;
    const userId = req.query.userId;
    //If the user is visiting his/her own profile
    if (id === userId) {
      return res.redirect("/myaccount");
    }
    //If it's not his/her own profile
    const user = await User.findById(userId).select(
      "-password -likedQuestions -likedAnswers -email -answeredQuestions"
    );
    if (!user) {
      const error = new Error("No user found!");
      next(error);
    }
    const userDetails = {
      ...user._doc,
      questions: user.questions.length,
      followers: user.followers.length,
      followings: user.followings.length,
      answers: user.answers.length,
    };
    const isFound = user.followings.find((followingUser) => {
      followingUser === userId;
    });

    const isFollowing = isFound === undefined ? false : true;
    console.log(isFollowing);
    console.log(userDetails);
    res.render("PublicProfile", { profile: userDetails, isFollowing });
  } catch (err) {
    next(err);
  }
};

exports.follow = async (req, res, next) => {
  try {
    const id = req.session.user._id;
    const userId = req.query.userId;

    if (userId === undefined) {
      const error = new Error("No userId found!");
      error.statusCode(404);
      throw error;
    }

    if (id === userId) {
      const error = new Error("Can not follow himself/herself");
      error.statusCode = 400;
      throw error;
    }

    const followerUser = await User.findById(id).select("followings");
    const followingUser = await User.findById(userId).select("followers");

    if (!followerUser || !followingUser) {
      const error = new Error("User not found!");
      error.statusCode = 404;
      throw error;
    }

    const isFollowing = followerUser.followings.find(
      (followingUserId) => followingUserId == userId
    );
    //If the user is already following
    if (isFollowing !== undefined) {
      const error = new Error("Already following this user");
      error.statusCode = 422;
      throw error;
    }
    //If the user is not following already
    const updatedFollowings = followerUser.followings;
    updatedFollowings.push(userId);
    followerUser.followings = updatedFollowings;

    const updatedFollowers = followingUser.followers;
    updatedFollowers.push(id);
    followingUser.followers = updatedFollowers;

    const updatedFollowerUser = await followerUser.save();
    const updatedFollowingUser = await followingUser.save();

    res.status(200).json({
      message: "successfull",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(err.statusCode).json({
      message: err.message,
    });
  }
};

exports.unfollow = async (req, res, next) => {
  try {
    const id = req.session.user._id;
    const userId = req.query.userId;

    if (userId === undefined) {
      const error = new Error("No userId found!");
      error.statusCode(404);
      throw error;
    }

    if (id === userId) {
      const error = new Error("Can not unfollow himself/herself");
      error.statusCode = 400;
      throw error;
    }
    //followerUser is the user who is going to follow and followingUser is the user
    //who will be followed.
    const followerUser = await User.findById(id).select("followings");
    const followingUser = await User.findById(userId).select("followers");

    if (!followerUser || !followingUser) {
      const error = new Error("User not found!");
      error.statusCode = 404;
      throw error;
    }

    const followingIndex = followerUser.followings.find(
      (followingUserId) => followingUserId == userId
    );

    const followerIndex = followingUser.followers.find(
      (followerUserId) => followerUserId == id
    );
    //If the user is NOT already following
    if (followingIndex === undefined || followerIndex === undefined) {
      const error = new Error("First follow to unfollow");
      error.statusCode = 422;
      throw error;
    }
    //If the user following already
    const updatedFollowings = followerUser.followings;
    updatedFollowings.splice(followingIndex, 1);
    followerUser.followings = updatedFollowings;

    const updatedFollowers = followingUser.followers;
    updatedFollowers.splice(followerIndex, 1);
    followingUser.followers = updatedFollowers;

    const updatedFollowerUser = await followerUser.save();
    const updatedFollowingUser = await followingUser.save();

    res.status(200).json({
      message: "successfull",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(err.statusCode).json({
      message: err.message,
    });
  }
};

// Edit Profile

exports.getEditProfile = async (req, res, next) => {
  try {
    const id = req.session.user._id;
    if (id === undefined) {
      const error = new Error("No userId found!");
      error.statusCode(404);
      throw error;
    }
    const user = await User.findById(id);
    if (!user) {
      return res.render("Editprofile", { error: "No user is found!" });
    } else {
      console.log(user);
      return res.render("EditProfile", { error: "", userData: user });
    }
  } catch (err) {
    next(err);
  }
};

// Post Edit Profile

exports.postEditProfile = async (req, res, next) => {
  try {
    const id = req.session.user._id;
    const name = req.body.name;
    const branch = req.body.branch;
    const bio = req.body.bio;
    if (name === undefined || bio === undefined || branch === undefined) {
      const error = new Error("No userId found!");
      error.statusCode(404);
      throw error;
    } else {
      const user = await User.findById(id);
      user.name = name;
      user.branch = branch;
      user.intro = bio;
      const newUserData = await user.save();
      // console.log(newUserData);
      res.redirect("/EditProfile");
    }
  } catch (error) {
    next(err);
  }
};
