const Listing = require("../models/listing");
const Review = require("../models/reviews");

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.auther = req.user._id;
    await newReview.save()
    listing.reviews.push(newReview);
    await listing.save();
    req.flash("success","New Review is Posted");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review is Deleted");
    res.redirect(`/listings/${id}`);
}