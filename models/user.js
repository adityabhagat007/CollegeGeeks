const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: String,
  },
  branch: {
    type: String,
    required: true,
  },
  intro: {
    type: String,
    default: "Hello! I am new to CollegeGeeks.",
  },
  dp: {
    type: String,
    default: "/images/user.png",
  },
  questions: [{ type: Schema.Types.ObjectId }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  likedQuestions: [{ type: Schema.Types.ObjectId }],
  likedAnswers: [{ type: Schema.Types.ObjectId }],
  answers: [{ type: Schema.Types.ObjectId }],
  followings: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("User", userSchema);
