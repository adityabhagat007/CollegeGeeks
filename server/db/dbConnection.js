const express = require("express");
const mongoose = require("mongoose");

const dbConnection = mongoose
  .connect(
    "mongodb+srv://Admin-CollegeGeeks:CollegeGeeks@2021@cluster0.olwlm.mongodb.net/CollegeGeeksDB",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(console.log("Connected to mongoDB Atlas to CollegeGeeksDB"));

module.exports.dbConnection = dbConnection;
