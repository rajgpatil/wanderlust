const User = require("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    res.render("./user/signup.ejs");
}

module.exports.signup = async(req,res)=>{
    try{
        let{email,username,password} = req.body;
        let user = new User({
            email: email,
            username: username
        })
        let registeredUser = await User.register(user,password);
        // console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        })
        
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("./user/login.ejs");
}

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust");
    res.redirect( res.locals.redirectUrl ||"/listings");
}

module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are Logged Out!");
        res.redirect("/listings");
    })
}