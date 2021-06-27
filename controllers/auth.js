const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const User = require("../models/user");
const TempUser = require("../models/tempUser");
const genToken = require("../utils/genToken");
const sendEmail = require("../utils/sendEmail");
const getText = require("../texts/verificationText");

exports.getLoginPage = (req, res, next) => {
  res.render("login");
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let user;

  User.findOne({ email: email })
    .then((foundUser) => {
      if (!foundUser) {
        //This emails is not registered yet!!
        return res.redirect("/Signup");
      }
      user = foundUser;
      return bcrypt.compare(password, foundUser.password);
    })
    .then((isCorrect) => {
      if (isCorrect) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save((err) => {
          if (err) {
            throw err;
          }
          //Correct password
          res.redirect("/home");
        });
      }
      //Incorrect password
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.getSignupPage = (req, res, next) => {
  res.render("Signup");
};

exports.postSignup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("Signup");
    //We should pass an object to display errors {errors : errors.array()}
  }
  let token;
  let text;
  genToken()
    .then((result) => {
      token = result;
      text = getText(result);
      return bcrypt.hash(req.body.password, 12);
    })
    .then((hash) => {
      const tempUser = new TempUser({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        branch: req.body.branch,
        token: token,
      });
      return tempUser.save();
    })
    .then((result) => {
      return sendEmail(req.body.email, "Email Verification", text);
    })
    .then((response) => {
      res.render("verification");
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.verifyToken = (req, res, next) => {
  const token = req.params.token;
  TempUser.findOne({ token: token })
    .exec()
    .then((tempUser) => {
      if (!tempUser) {
        const error = new Error("Wrong Link");
        throw error;
      }
      const user = new User({
        name: tempUser.name,
        email: tempUser.email,
        password: tempUser.password,
        branch: tempUser.branch,
      });
      return user.save();
    })
    .then((result) => {
      return TempUser.deleteOne({ token: token });
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
