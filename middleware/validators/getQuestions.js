module.exports = (req, res, next) => {
  try {
    const page = req.body.page;
    const category = req.body.category;
    //Checking page
    if (page < 1) {
      req.falsh("error", "Please enter a correct page value!");
      return req.redirect("/home");
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
    //If validation is successfull the moving to next
    next();
  } catch (err) {
    next(err);
  }
};
