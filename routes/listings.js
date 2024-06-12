const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
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

//category page
router.get("/category",wrapAsync(listingsController.showCategory));

//search
router.post("/search",wrapAsync(listingsController.searchListings));

router.route("/:id")
    .get(wrapAsync(listingsController.showListings))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingsController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingsController.destroyListing))

//edit page
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingsController.renderEditForm));

module.exports = router;
