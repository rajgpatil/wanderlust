const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const ExpressError = require("./utils/expressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.isAuthenticated());
    // console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        // console.log(req.originalUrl);
        req.flash("error","You can not Loged in so Please Login to Wanderlust");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let checkOwner = await Listing.findById(id);
    if(res.locals.currUser && !checkOwner.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not Owner of this Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400,errMsg);
        }
        else{
            next();
        }
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

module.exports.isReviewAuther = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let checkauther = await Review.findById(reviewId);
    // console.log(checkauther);
    if(res.locals.currUser && !checkauther.auther._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not Created this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}