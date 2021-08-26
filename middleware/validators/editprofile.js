module.exports = (req, res, next) =>{
    try{
    const id = req.session.user._id;
    const branch = req.body.branch;
    const bio = req.body.bio.trim();
    if(branch === undefined || bio === undefined || id=== undefined ){
        const error = new Error("User Not Found");
        throw error;
    }
    // branch validation
    if(
        branch !== "CSE" &&
        branch !== "ECE" &&
        branch !== "EE" &&
        branch !== "ME" &&
        branch !== "CE" &&
        branch !== "CT" &&
        branch !== "LT" &&
        branch !== "FT"
     ){
        req.flash("error", "Select Your Branch Correctly");
        res.render("EditProfile", { errors: req.flash("error") });
    }
    // all fine then 
    next();
}catch(error){
    next(error);
}
}