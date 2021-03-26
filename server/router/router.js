const route = require("express").Router();

route.get("/" , (req, res) => {
  res.render("index");
});

module.exports = route;
