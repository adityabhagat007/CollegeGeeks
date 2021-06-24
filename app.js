/********** CORE MODULES **********/
const path = require("path");

/********** NPM MODULES ***********/

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

// const dbConnection = require("./server/db/dbConnection");

/************* CUSTOM MODULES  *************/

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

/**************** INITIAL SETUP ***********************/

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

app.use(feedRoutes);
app.use(authRoutes);

/******** SERVER SETUP **********/

mongoose
  .connect(
    "mongodb+srv://Admin-CollegeGeeks:CollegeGeeks@2021@cluster0.olwlm.mongodb.net/CollegeGeeksDB",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Conneted to DB server");
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  });
