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

exports.postAskQuestion = async (req, res, next) => {
  try {
    //Pulling the data out from request body
    const statement = req.body.statement;
    const category = req.body.category;
    //
  } catch (err) {
    next(err);
  }
};
