const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userControllers = require("../controllers/users.js");
const Listing = require("../models/listing");

router.get("/", async(req, res) => {
    const allListings = await Listing.find({});
    const search = "";
    res.render("listings/index.ejs", {allListings, search});
})

router.route("/signup")
.get(userControllers.renderSignupForm)
.post(wrapAsync(userControllers.signup));

router.route("/login")
.get(userControllers.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userControllers.login)



router.get("/logout", userControllers.logout);

module.exports = router;