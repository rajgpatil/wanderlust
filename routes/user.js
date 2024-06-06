const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

//controller
const userController = require("../controllers/users.js");

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup))

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),userController.login);

//signup route
// router.get("/signup",userController.renderSignupForm);

//signup
// router.post("/signup",wrapAsync(userController.signup));

//login route
// router.get("/login",userController.renderLoginForm);

//login
// router.post("/login",saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),userController.login);

//logout
router.get("/logout",userController.logout);

module.exports = router;