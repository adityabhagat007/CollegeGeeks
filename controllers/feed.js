const { unlink } = require("fs/promises");
const path = require("path");

const Answer = require("../models/answer");
const Question = require("../models/question");
const User = require("../models/user");
const {cloudinary} =require("../middleware/multerConfig");

exports.getLandingPage = (req, res, next) => {
    res.render("index", { isLoggedIn: req.loginStatus });
};

exports.getAboutPage = (req, res, next) => {
    res.render("aboutus", { isLoggedIn: req.loginStatus });
};

exports.getHomePage = async (req, res, next) => {
    try {
        //pulling data out from req
        const page = req.query.page || 1; //Default 1
        const category = req.session.user.branch.toLowerCase();
        const id = req.session.user._id;
        //Calculating total number of pages
        const totalQuestions = await Question.countDocuments({ category });
        const totalPages = Math.ceil(totalQuestions / 10);
        //Finding requested questions
        const questions = await Question.find({ category })
            .skip((page - 1) * 10)
            .limit(10);
        const user = await User.findById(id).select("name");
        if (!questions) {
            return res.render("home", { user: user, error: "Can not find any questions" });
        }
        if (!user) {
            return res.render("home", { user: "", error: "Can not find user" });
        }
        //If we get questions
        res.render("home", {
            user: user,
            userId:id,
            questions,
            error: req.flash("error"),
            totalPages,
            currentPage: page,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getUserActivity = (req, res, next) => {
    res.render("userActivity");
};

exports.getForgetPassword = (req, res, next) => {
    res.render("forgetPassword");
};

exports.postAskQuestion = async (req, res, next) => {
    try {
        //Pulling the data out from request body
        const statement = req.body.statement;
        const category = req.body.category.toLowerCase();
        //Getting the user data
        const userId = req.session.user._id;
        const user = await User.findById(userId);
        //Creating a new question doc
        const newQuestion = new Question({
            author: user._id,
            authorName: user.name,
            statement: statement,
            category: category,
        });

        const question = await newQuestion.save();
        //Connecting the question with the author
        const questions = user.questions;
        questions.push(question._id);
        user.questions = questions;
        const updatedUser = await user.save();
        //If everything goes alright
        res.redirect("/home");
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getQuestions = async (req, res, next) => {
    try {
        //pulling data out from req
        const page = req.query.page || 1; //Default 1
        const category = req.query.category || req.session.user.category || "cse";
        //Finding total number of pages
        const totalQuestions = await Question.countDocuments({ category });
        const totalPages = Math.ceil(totalQuestions / 10);
        //Finding requested questions
        const questions = await Question.find({ category })
            .skip((page - 1) * 10)
            .limit(10);
        if (!questions) {
            return res.render("questions", {
                error: "Can not find any questions",
                isLoggedIn: req.loginStatus,
            });
        }
        //If we get questions
        res.render("questions", {
            questions,
            totalPages,
            currentPage: page,
            error: "",
            isLoggedIn: req.loginStatus,
        });
    } catch (err) {
        next(err);
    }
};

exports.getQuestion = async (req, res, next) => {
    try {
        const questionId = req.query.questionId;
        if (questionId === undefined || questionId.length !== 24) {
            return res.render("questionPage", {
                error: "Please attach a valid question id!",
            });
        }
        //If an id is found
        const question = await Question.findById(questionId).populate("answers");
        if (!question) {
            return res.render("questionPage", {
                error: "Sorry! this question can not be found.",
            });
        }
        //If we get a question
        res.render("questionPage", { question, error: req.flash("error") });


    } catch (err) {
        next(err);
    }
};

exports.getProfile = async (req, res, next) => {
    try {
        const userId = req.session.user._id;

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.render("myaccount", { error: "No user is found!" });
        }

        const profile = {
            ...user._doc,
            questions: user.questions.length,
            followers: user.followers.length,
            likedQuestions: user.likedQuestions.length,
            likedAnswers: user.likedAnswers.length,
            answers: user.answers.length,
            followings: user.followings.length,
            answeredQuestions: user.answeredQuestions.length,
        };
        res.render("myaccount", { profile, error: req.flash("error") });
    } catch (err) {
        next(err);
    }
};

exports.getActivity = async (req, res, next) => {
    try {
        const userId = req.session.user._id;

        const activity = await User.findById(userId)
            .select("questions answeredQuestions")
            .populate({
                path: "questions answeredQuestions",
                select: "-answers",
            });

        if (!activity) {
            return res.render("userActivity", { error: "no activity found!" });
        }
        //If activity is found;
        res.render("userActivity", { error: "", activity });
    } catch (err) {
        next(err);
    }
};

exports.postNewAnswer = async (req, res, next) => {
    try {
        const answerContent = req.body.answer;
        const questionId = req.body.questionId;
        const userId = req.session.user._id;
        //Validation of answer
        if (!answerContent || answerContent.length === 0) {
            req.flash("error", "Answer can not be empty!");
            return res.redirect(`/questionPage?questionId=${questionId}`);
        }

        //Getting the user and the question
        const user = await User.findById(userId);
        const question = await Question.findById(questionId);
        if (!user) {
            req.flash("error", "User not found!");
            return res.redirect(`/questionPage?questionId=${questionId}`);
        }
        if (!question) {
            req.flash("error", "Question not found!");
            return res.redirect(`/questionPage?questionId=${questionId}`);
        }
        //Creating a new answer doc
        const newAnswer = new Answer({
            author: user._id,
            authorName: user.name,
            content: answerContent,
            question: questionId,
        });

        const answer = await newAnswer.save();
        //connecting docs
        const updatedAnswers = question.answers;
        updatedAnswers.push(answer);
        question.answers = updatedAnswers;

        const updatedUserAnswers = user.answers;
        updatedUserAnswers.push(answer);
        user.answers = updatedUserAnswers;

        const updatedAnsweredQuestions = user.answeredQuestions;
        updatedAnsweredQuestions.push(questionId);
        user.answeredQuestions = updatedAnsweredQuestions;

        const updatedUser = await user.save();
        const updatedQuestion = await question.save();

        //If everything is successfull;
        res.redirect(`/questionPage?questionId=${questionId}`);
    } catch (err) {
        next(err);
    }
};



exports.getPublicProfile = async (req, res, next) => {
    try {
        const id = req.session.user._id;
        const userId = req.query.userId;
        //If the user is visiting his/her own profile
        if (id === userId) {
            return res.redirect("/myaccount");
        }
        //If it's not his/her own profile
        //The public profile
        const publicUser = await User.findById(userId).select(
            "-password -likedQuestions -likedAnswers -email -answeredQuestions"
        );
        //Own account
        const user = await User.findById(id).select("followings");
        if (!publicUser || !user) {
            const error = new Error("No user found!");
            next(error);
        }
        const publicUserDetails = {
            ...publicUser._doc,
            questions: publicUser.questions.length,
            followers: publicUser.followers.length,
            followings: publicUser.followings.length,
            answers: publicUser.answers.length,
        };
        const isFound = user.followings.find(
            (followingUser) => followingUser.toString() === userId
        );
        const isFollowing = isFound === undefined ? false : true;
        res.render("PublicProfile", { profile: publicUserDetails, isFollowing });
    } catch (err) {
        next(err);
    }
};


exports.follow = async (req, res, next) => {
    try {
        const id = req.session.user._id;
        const userId = req.query.userId;

        if (userId === undefined) {
            const error = new Error("No userId found!");
            error.statusCode(404);
            throw error;
        }

        if (id === userId) {
            const error = new Error("Can not follow himself/herself");
            error.statusCode = 400;
            throw error;
        }

        const followerUser = await User.findById(id).select("followings");
        const followingUser = await User.findById(userId).select("followers");

        if (!followerUser || !followingUser) {
            const error = new Error("User not found!");
            error.statusCode = 404;
            throw error;
        }

        const isFollowing = followerUser.followings.findIndex(
            (followingUserId) => followingUserId.toString() === userId
        );
        //If the user is already following
        if (isFollowing !== -1) {
            const error = new Error("Already following this user");
            error.statusCode = 422;
            throw error;
        }
        //If the user is not following already
        const updatedFollowings = followerUser.followings;
        updatedFollowings.push(userId);
        followerUser.followings = updatedFollowings;

        const updatedFollowers = followingUser.followers;
        updatedFollowers.push(id);
        followingUser.followers = updatedFollowers;

        const updatedFollowerUser = await followerUser.save();
        const updatedFollowingUser = await followingUser.save();

        res.status(200).json({
            message: "Successfully Followed",
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        res.status(err.statusCode).json({
            message: err.message,
        });
    }
};

exports.unfollow = async (req, res, next) => {
    try {
        const id = req.session.user._id;
        const userId = req.query.userId;

        if (userId === undefined) {
            const error = new Error("No userId found!");
            error.statusCode(404);
            throw error;
        }

        if (id === userId) {
            const error = new Error("Can not unfollow himself/herself");
            error.statusCode = 400;
            throw error;
        }
        //followerUser is the user who is going to follow and followingUser is the user
        //who will be followed.
        const followerUser = await User.findById(id).select("followings");
        const followingUser = await User.findById(userId).select("followers");

        if (!followerUser || !followingUser) {
            const error = new Error("User not found!");
            error.statusCode = 404;
            throw error;
        }

        const followingIndex = followerUser.followings.findIndex(
            (followingUserId) => followingUserId.toString() === userId
        );

        const followerIndex = followingUser.followers.findIndex(
            (followerUserId) => followerUserId.toString() === id
        );
        //If the user is NOT already following
        if (followingIndex === -1 || followerIndex === -1) {
            const error = new Error("First follow to unfollow");
            error.statusCode = 422;
            throw error;
        }
        //If the user following already
        const updatedFollowings = followerUser.followings;
        updatedFollowings.splice(followingIndex, 1);
        followerUser.followings = updatedFollowings;

        const updatedFollowers = followingUser.followers;
        updatedFollowers.splice(followerIndex, 1);
        followingUser.followers = updatedFollowers;
        
        const updatedFollowerUser = await followerUser.save();
        const updatedFollowingUser = await followingUser.save();

        res.status(200).json({
            message: "Successfully Unfollowed",
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        res.status(err.statusCode).json({
            message: err.message,
        });
    }
};

// Edit Profile

exports.getEditProfile = async (req, res, next) => {
    try {
        const id = req.session.user._id;
        if (id === undefined) {
            const error = new Error("No userId found!");
            error.statusCode(404);
            throw error;
        }
        const user = await User.findById(id);
        if (!user) {
            return res.render("Editprofile", { errors: "No user is found!" });
        } else {
            return res.render("Editprofile", {
                errors: "",
                userData: user,
                success: "",
            });
        }
    } catch (err) {
        next(err);
    }
};

// Post Edit Profile

exports.postEditProfile = async (req, res, next) => {
    try {
        const id = req.session.user._id;
        const branch = req.body.branch;
        const bio = req.body.bio.trim();

        // set up new branch for user
        req.session.user.branch = branch;

        const user = await User.findById(id).select("name branch intro");
        user.branch = branch;
        user.intro = bio;
        const newUserData = await user.save();

        req.flash("success", "You have Successfully Updated the your info");
        res.render("Editprofile", {
            userData: newUserData,
            errors: "",
            success: req.flash("success"),
        });
    } catch (error) {
        next(error);
    }
};



exports.getMyNetwork = async (req, res, next) => {
    try {
        const id = req.session.user._id;
        //Finding user
        const user = await User.findById(id)
            .select("followings followers")
            .populate({
                path: "followings followers",
                select: "name",
            });
        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        //If we get user
        res.status(200).json({
            message: "Successfull",
            network: user,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    };
}





exports.postProfileDp = async (req, res, next) => {
    // try {
    //     const id = req.session.user._id;
    //     const finalName = req.finalName;
    //     const newPath = "/uploads/" + req.finalName;
    //     //finding dpPath
    //     const user = await User.findById(id).select("dp");
    //     //If no user is found
    //     if (!user) {
    //         return redirect("/404");
    //     }
    //     //Extracting old path
    //     const oldPath = user.dp;
    //     //If the photo is not the default photo then deleting it
    //     if (oldPath !== "/images/user.png") {
    //         await unlink(path.join(__dirname, "../public", oldPath));
    //     }
    //     //If path is found then replacing
    //     user.dp = newPath;
    //     //Saving updated doc
    //     const updatedPath = await user.save();

    //     res.redirect("/myaccount");
    // } catch (err) {
    //     if (!err.statusCode) {
    //         err.statusCode = 500;
    //     }
    //     next(err);
    // }
    try{
        const id = req.session.user._id;
        const finalName = req.file;
        console.log(finalName)
        const user = await User.findById(id).select("dp dpFilename");
        //If no user is found
        if (!user) {
            return redirect("/404");
        }
        if(user.dp!=="/images/user.png" && user.dpFilename !== "collegegeeks"){
            cloudinary.uploader.destroy(user.dpFilename);
        }
        user.dp = finalName.path;
        user.dpFilename = finalName.filename;
        const newDp = await user.save();
        res.redirect('/myaccount');
    }catch(error){
        console.log(error);
    }
}
// Edit question

exports.postEditQuestion = async (req,res,next)=>{

    const editedQuestion = req.body.statement.trim();
    const branch = req.body.category.toLowerCase();
    const questionId = req.body.editId;
    
    const question = await Question.findById(questionId);
    if(!question){
        return res.render('home',{error:"Question not Found"});
    }

    question.statement = editedQuestion;
    question.category = branch ;

    const newQuestion = await question.save();
    res.redirect('home')
}
