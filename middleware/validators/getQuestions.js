module.exports = (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const category = req.query.category || req.session.user.branch || "cse";
    //Checking page
    if (page < 1) {
      return res.render("questions", {
        error: "Please enter a correct page value!",
        isLoggedIn: req.loginStatus,
      });
    }
    //Checking category
    if (
      category !== "ece" &&
      category !== "cse" &&
      category !== "ee" &&
      category !== "me" &&
      category !== "ce" &&
      category !== "ct" &&
      category !== "lt" &&
      category !== "ft" &&
      category !== "cv" &&
      category !== "ot"
    ) {
      return res.render("questions", {
        error: "Invalid category",
        isLoggedIn: req.loginStatus,
      });
    }
    //If validation is successful then moving to next
    next();
  } catch (err) {
    next(err);
  }
};
