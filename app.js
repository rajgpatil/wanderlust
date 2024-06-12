if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmade = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/expressError.js");
// const {listingSchema,reviewSchema} = require("./schema.js");
// const Review = require("./models/reviews.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


//routers
const listingsRoute = require("./routes/listings.js");
const reviewsRoute = require("./routes/reviews.js");
const userRoute = require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsmade);
app.use(express.static(path.join(__dirname,"/public")));

const dbUrl = process.env.ATLASDB_URL;

async function main(){
    await mongoose.connect(dbUrl);
}

//MongoDb Connection
main().then(()=>{
    console.log("Connected Succsesfully");
})
.catch((err)=>{
    console.log(err);
})

app.listen(8080,()=>{
    console.log("App was listening on port 8080");
})

const store =  MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
})

store.on("error",()=>{
    console.log("error in MONGO SESSION STORE ",err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOptions));

//use flash
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

//routers
app.use("/listings",listingsRoute);
app.use("/listings/:id/review",reviewsRoute);
app.use("/",userRoute);

//404 routh
app.use("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
})

//Error handling middleware
app.use((err,req,res,next)=>{
    let {statuscode=500,message="Something went wroung"} = err;
    res.status(statuscode).render("./error.ejs",{message});
})
