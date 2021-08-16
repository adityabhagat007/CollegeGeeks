const validator = require("validator");

module.exports = (req, res, next) => {
  try {
    const statement = req.body.statement;
    const category = req.body.category;
    //Checking statement
    if (validator.isEmpty(statement)) {
      req.flash("error", "Please add a valid question");
      return res.redirect("/home");
    }
    //Checking category
    if (
      category !== "ECE" &&
      category !== "CSE" &&
      category !== "EE" &&
      category !== "ME" &&
      category !== "CE" &&
      category !== "CT" &&
      category !== "ECE" &&
      category !== "LT" &&
      category !== "FT" &&
      category !== "OT"
    ) {
      req.flash("error", "Invalid category");
      return res.redirect("/home");
    }
    //If validation is successfull
    next();
  } catch (err) {
    next(err);
  }
};
