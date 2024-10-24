const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
const Listing = require("../models/listing");

router.route("/")
.get(wrapAsync(listingControllers.index))
.post(isLoggedIn, upload.single('listing[image]'), validateListing,  wrapAsync(listingControllers.createListing));

router.post("/search", async(req, res) => {
    var search = req.body.search.split(" ").join("").toUpperCase();
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings, search});
})

//New Route
router.get("/new", isLoggedIn, wrapAsync(listingControllers.renderNewForm));

router.route("/:id")
.get(wrapAsync(listingControllers.showListing))
.patch(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingControllers.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingControllers.destroyListing))



// Edit Route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingControllers.renderEditForm));



module.exports = router;