const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}

module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new.ejs");
}

module.exports.showListings = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"auther"}}).populate("owner");
    if(!listing){
        req.flash("error","You Requesting Listing is Not Exist ");
        res.redirect("/listings");
    }else{
        res.render("./listings/show.ejs",{listing});   
    }
}

module.exports.createListing = async(req,res,next)=>{
        let listing =new Listing(req.body.listing);

        let response = await geocodingClient.forwardGeocode({
            query: listing.location,
            limit: 1
          })
            .send()

        let url = req.file.path;
        let filename= req.file.filename;
        listing.owner = req.user._id;
        listing.image = {url,filename};
        listing.geometry = response.body.features[0].geometry;
        let savedListing = await listing.save();
        req.flash("success","New Listing is Created");
        res.redirect("/listings");
}

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","You Requesting Listing is Not Exist");
        res.redirect("/listings");
    }else{
        originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
        res.render("./listings/edit.ejs",{listing, originalImageUrl });
    }
}

module.exports.updateListing = async(req,res,next)=>{
    let {id} = req.params;
    let listing = req.body.listing;
    let updatedListing = await Listing.findByIdAndUpdate(id,{...listing});
    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = {url,filename};
        updatedListing.save();
    }

    req.flash("success","Listing is Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing is Deleted");
    res.redirect("/listings");
}

module.exports.showCategory = async (req,res)=>{
    let allListings = await Listing.find({});
    let {type} = req.query;
    res.render("./listings/category.ejs",{allListings,type})
}

module.exports.searchListings = async (req,res)=>{
    let allListings = await Listing.find({});
    let search = req.body.search;
    res.render("./listings/search.ejs",{allListings,search});
}