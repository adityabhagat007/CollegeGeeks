const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const dbConnection = require("./server/db/dbConnection");

/**************** INITIAL MODULES SETUP ***********************/

const app = express();
app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/************* Static files ***********/

app.use(express.static(path.join(__dirname, "public")));

/********** SETTING UP ROUTES *************/

app.use("/", require("./server/router/router"));

app.use("/home", require("./server/router/router"));

app.use("/about", require("./server/router/router"));

app.use("/Signup", require("./server/router/router"));

app.use("/login", require("./server/router/router"));

app.use("/myaccount", require("./server/router/router"));

/******** Port setup **********/

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
