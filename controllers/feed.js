exports.getLandingPage = (req, res, next) => {
    res.render("index");
}

exports.getAboutPage = (req, res, next) => {
    res.render("aboutus");
}

exports.getHomePage = (req, res, next) => {
    res.render("home");
}

exports.getMyAccount = (req, res, next) => {
    res.render("myaccount");
}
exports.getQuestionPage = (req, res, next) => {
    res.render("questionPage");
}