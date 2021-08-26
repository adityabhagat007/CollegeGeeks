module.exports = (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    //Checking page
    if (page < 1) {
      return res.render("home", {
        error: "Please enter a correct page value!",
      });
    }
    //If validation is successful the moving to next
    next();
  } catch (err) {
    next(err);
  }
};
