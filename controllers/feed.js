exports.getLandingPage = (req, res, next) => {
  res.render("index", { isLoggedIn: req.loginStatus });
};

exports.getAboutPage = (req, res, next) => {
  res.render("aboutus", { isLoggedIn: req.loginStatus });
};

exports.getHomePage = (req, res, next) => {
  res.render("home");
};

exports.getMyAccount = (req, res, next) => {
  res.render("myaccount");
};
exports.getQuestionPage = (req, res, next) => {
  res.render("questionPage");
};
