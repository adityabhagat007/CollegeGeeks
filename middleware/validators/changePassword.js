const validator = require("validator");

module.exports = (req, res, next) => {
  try {
    const newPassword = req.body.newPassword;
    if (!validator.isStrongPassword(newPassword)) {
      req.flash("error", "Please use a strong password!");
      return res.redirect("/myaccount");
    }
    //If everything is successful
    next();
  } catch (err) {
    next(err);
  }
};
