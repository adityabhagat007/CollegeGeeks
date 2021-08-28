const validator = require("validator");

module.exports = (req, res, next) => {
  try {
    const newPassword = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const token = req.params.token;
    if(newPassword === undefined || confirmPassword == undefined ){
      const error = new Error ("InValid Input")
      throw error ;
    }
    if(newPassword === "" || confirmPassword === ""){
      req.flash("error", "Please fill the form correctly ");
      return res.redirect(
        "https://collegegeeks.herokuapp.com/auth/forget-password/${token}"
      );
    }
    if (!validator.isStrongPassword(newPassword)) {
      req.flash("error", "Please use a strong password!");
      return res.redirect(
        "https://collegegeeks.herokuapp.com/auth/forget-password/${token}"
      );
    }
    if (newPassword !== confirmPassword) {
      req.flash("error", "Password and confirm password does not matched.");
      return res.redirect(
        `https://collegegeeks.herokuapp.com/forget-password/${token}`
      );
    }
    //If everything is successful
    next();
  } catch (err) {
    next(err);
  }
};
