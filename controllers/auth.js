const bcrypt = require("bcryptjs");
const flash = require("connect-flash");

const User = require("../models/user");
const TempUser = require("../models/tempUser");
const genToken = require("../utils/genToken");
const sendEmail = require("../utils/sendEmail");
const genText = require("../texts/verificationText");

exports.getLoginPage = (req, res, next) => {
  res.render("login");
};

exports.postLogin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email });
    //If no user is found
    if (!user) {
      req.flash("error", `${email} this email is not registered please signup`);
      return res.redirect("/Signup");
    }
    //checking password
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      req.flash("error", "Please enter correct password.");
      res.redirect("/login");
    }
    //If password is correct then setting a session
    req.session.isLoggedIn = true;
    req.session.user = user;
    const result = req.session.save();
    //If everything is alright then redirecting to home
    res.redirect("/home");
  } catch (err) {
    next(err);
  }
};

exports.getSignupPage = (req, res, next) => {
  res.render("Signup");
};

exports.postSignup = async (req, res, next) => {
  try {
    const token = await genToken();
    const text = genText(token);
    const hash = await bcrypt.hash(req.body.password, 12);
    //Calculating expiration time
    const currDate = new Date();
    const expirationTime = new Date(currDate.getTime() + 30 * 60000);
    //Creating a new temp user
    const tempUser = new TempUser({
      name: req.body.name,
      email: req.body.email,
      password: hash,
      branch: req.body.branch,
      token: token,
      expirationTime,
    });
    const savedTempUser = await tempUser.save();
    //If user is saved correctly the sending email
    const result = await sendEmail(req.body.email, "Email Verification", text);
    //If email is sent successfully
    res.render("verification");
  } catch (err) {
    if (!err.stausCode) {
      err.stausCode = 500;
    }
    next(err);
  }
};

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.params.token;
    const currDate = new Date();
    console.log(currDate);
    const tempUser = await TempUser.findOne({
      token,
      expirationTime: { $gte: currDate },
    });
    //If no user is found then sending to signup
    if (!tempUser) {
      req.flash("error", "Email verification failed");
      return res.redirect("/Signup");
    }
    //If email verification is successfull then creating a new user
    const user = new User({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      branch: tempUser.branch,
    });
    const savedUser = await user.save();
    const result = await TempUser.deleteOne({ token: token });
    //If everything is successfull
    req.flash("success", "Email verification is successfull.");
    res.redirect("/login");
  } catch (err) {
    next(err);
  }
};
