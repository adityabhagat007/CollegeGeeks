const validator = require("validator");

const User = require("../../models/user");

module.exports = async (req, res, next) => {
  try {
    const email = req.body.email;
    const name = req.body.name;
    const branch = req.body.branch.toLowerCase();
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    // Branch Validation
    // if(branch === "error"){
    //   req.flash("error", "Enter Your Branch Correctly");
    //   return res.redirect("/Signup");
    // }

    //Email validation
    if (!validator.isEmail(email)) {
      req.flash("error", "Please enter a valid email address");
      return res.redirect("/Signup");
    }
    //Checking if the email is already Registered
    const user = await User.findOne({ email });
    //If any user is present with that email then rejecting the request
    if (user) {
      req.flash(
        "error",
        `${email} this email is already registered please log in or use another email.`
      );
      return res.redirect("/Signup");
    }
    //Name validation
    if (validator.isEmpty(name)) {
      req.flash("error", "Name can not be empty");
      return res.redirect("/Signup");
    }
    //Branch validation
    if (
      // branch !== "error"&&
      branch !== "cse" &&
      branch !== "ece" &&
      branch !== "ee" &&
      branch !== "me" &&
      branch !== "ce" &&
      branch !== "ct" &&
      branch !== "lt" &&
      branch !== "ft" &&
      branch !== "cv"
    ) {
      req.flash("error", "Invalid branch");
      return res.redirect("/Signup");
    }
    //Password validation
    if (password !== confirmPassword) {
      req.flash("error", "Password and Confirm password does not match");
      return res.redirect("/Signup");
    }
    if (!validator.isStrongPassword(password)) {
      req.flash(
        "error",
        "Password should contain at least a special character an uppercase letter a lowercase letter a number and it must be at least 8 characters long."
      );
      return res.redirect("/Signup");
    }
    //If everything is successful
    next();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
