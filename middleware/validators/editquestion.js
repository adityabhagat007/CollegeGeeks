
const validator = require('validator');

module.exports = (req,res,next)=>{
    try{
     const question = req.body.statement.trim()
     const category = req.body.category.toLowerCase();
     const questionId = req.body.editId

     if(question === undefined || category === undefined || questionId === undefined){
         const error = new Error('Invalid Input');
         error.statusCode = 500;
         throw error
     }

     if(validator.isEmpty(question)){
         req.flash("error", "Please add a valid question");
          return res.redirect("/home");
     }
     if (
        category !== "ece" &&
        category !== "cse" &&
        category !== "ee" &&
        category !== "me" &&
        category !== "ce" &&
        category !== "ct" &&
        category !== "lt" &&
        category !== "ft" &&
        category !== "cv" &&
        category !== "ot"
      ) {
        req.flash("error", "Invalid category");
        return res.redirect("/home");
      } 
      next();
    }catch(err){
        next(err);
    }
}