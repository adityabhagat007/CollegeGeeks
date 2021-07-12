module.exports = (req, res, next) => {
  if (req.session.isLoggedIn) {
    req.loginStatus = true;
  } else {
    req.loginStatus = false;
  }
  next();
};
