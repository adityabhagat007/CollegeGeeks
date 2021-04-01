
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");

/**************** INITIAL MODULES SETUP ***********************/

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));

/************* Static files ***********/

app.use(express.static(path.join(__dirname , "public")));

/********** SETTING UP ROUTES *************/

app.use("/" , require("./server/router/router.js"));










/******** Port setup **********/

app.listen(8000 , () => {
  console.log("Server started on port 3000");
})


