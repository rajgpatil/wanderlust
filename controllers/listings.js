const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({});
    // console.log(allListings);
    res.render("./listings/index.ejs",{allListings});
}

module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new.ejs");
}

module.exports.showListings = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"auther"}}).populate("owner");
    // console.log(listing);
    if(!listing){
        req.flash("error","You Requesting Listing is Not Exist ");
        res.redirect("/listings");
    }else{
        // console.log(listing);
        res.render("./listings/show.ejs",{listing});   
    }
}

module.exports.createListing = async(req,res,next)=>{
    // try{
        // let listing = req.body.listing;
        // console.log(listing);

        // if(!req.body.listing){
        //     throw new ExpressError(400,"Send valid data for listing");
        // }
        let listing =new Listing(req.body.listing);
        // if(!listing.title){
        //     throw new ExpressError(400,"Tilte is missing");
        // }
        // if(!listing.description){
        //     throw new ExpressError(400,"description is missing");
        // }
        // if(!listing.location){
        //     throw new ExpressError(400,"location is missing");
        // }

        //the above proccess is the very lengthy because we are check the validation one by one, so to avoid this proble we are use the joi package as given below


        // let result = listingSchema.validate(req.body);
        // // console.log(result);
        // if(result.error){
        //     throw new ExpressError(400,result.error);
        // }

        let response = await geocodingClient.forwardGeocode({
            query: listing.location,
            limit: 1
          })
            .send()
        // console.log(response.body.features[0].geometry);

        let url = req.file.path;
        let filename= req.file.filename;
        // console.log(url,"..",filename);
        listing.owner = req.user._id;
        listing.image = {url,filename};
        listing.geometry = response.body.features[0].geometry;
        let savedListing = await listing.save();
        // console.log(savedListing);
        req.flash("success","New Listing is Created");
        res.redirect("/listings");
    // }
    // catch(err){
    //     next(err);
    // }
}

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    // console.log(listing);
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
    // if(!req.body.listing){
    //     next(new ExpressError(400,"Enter valid information for listings"));
    // }
    let listing = req.body.listing;
    // console.log(listing);
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