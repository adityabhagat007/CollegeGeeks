const route = require("express").Router();

route.get("/" , (req, res) => {
  res.render("index");
});
route.get("/Signup" , (req, res) => {
  res.render("Signup");
});
route.get("/about" , (req, res) => {
  res.render("aboutus");
});
route.get("/login" , (req, res) => {
  res.render("login");
});
route.get("/home" , (req, res) => {
  res.render("home");
});
route.get("/myaccount" , (req, res) => {
  res.render("myaccount");
});
module.exports = route;
