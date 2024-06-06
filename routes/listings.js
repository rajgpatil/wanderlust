const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
// const ExpressError = require("../utils/expressError.js");
// const {listingSchema} = require("../schema.js");
const {isLoggedIn,isOwner} = require("../middleware.js");
const {validateListing} = require("../middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


//controllers
const listingsController = require("../controllers/listings.js");

router.route("/")
    .get(wrapAsync(listingsController.index))
    .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingsController.createListing))

// new page
router.get("/new",isLoggedIn,listingsController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingsController.showListings))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingsController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingsController.destroyListing))

// index page
// router.get("/",wrapAsync(listingsController.index));


// show page
// router.get("/:id",wrapAsync(listingsController.showListings));



//Create routh
// router.post("/",isLoggedIn,validateListing,wrapAsync(listingsController.createListing));

//edit page
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingsController.renderEditForm));

//update routh
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingsController.updateListing));

//delete routh
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingsController.destroyListing));

module.exports = router;
