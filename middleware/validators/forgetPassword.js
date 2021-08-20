const validator = require("validator");

module.exports = (req, res, next) => {
  try {
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;
    const token = req.params.token;
    if (!validator.isStrongPassword(newPassword)) {
      req.flash("error", "Please use a strong password!");
      return res.redirect(
        "http://localhost:3000/auth/forget-password/${token}"
      );
    }
    if (password !== confirmPassword) {
      req.flash("error", "Password and confirm password doesnot matched.");
      return res.redirect(
        `http://localhost:3000/auth/forget-password/${token}`
      );
    }
    //If everything is successfull
    next();
  } catch (err) {
    next(err);
  }
};
