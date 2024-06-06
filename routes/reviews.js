const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
// const ExpressError = require("../utils/expressError.js");
// const {reviewSchema} = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn,isReviewAuther} = require("../middleware.js");

//controllers
const reviewController = require("../controllers/reviews.js");


//Review
//post review routh
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//delete review routh
router.delete("/:reviewId",isLoggedIn,isReviewAuther,wrapAsync(reviewController.destroyReview));

module.exports = router;