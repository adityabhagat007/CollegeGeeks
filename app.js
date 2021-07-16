/********** CORE MODULES **********/
const path = require("path");

/********** NPM MODULES ***********/

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
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

/*****************SESSION SETUP *************/

const store = MongoStore.create({
  mongoUrl: process.env.DB_URL,
  collectionName: "sessions",
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

/************* Flash Setup ***********/
app.use(flash());

/************* Static files ***********/

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, 'css')));

/********** SETTING UP ROUTES *************/

app.use(feedRoutes);
app.use(authRoutes);

/************* Error Handling ************/

app.use((error, req, res, next) => {
  console.log(error);
  res.send("Something went wrong.");
});

/************* 404 Not Found  */

app.use('*',(req, res, next) => {
  res.render("page404");
});

/******** SERVER SETUP **********/

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conneted to DB server");
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
