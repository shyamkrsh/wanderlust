const Listing = require("../models/listing");

module.exports.index = async(req, res)=>{
    const allListings = await Listing.find({});
    const search = "";
    res.render("listings/index.ejs", {allListings, search});
}
module.exports.renderNewForm = (req, res)=>{
    res.render("listings/new.ejs");
}
module.exports.showListing = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist !");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}
module.exports.createListing = async(req, res, next)=>{
    const url = req.file.path;
    const filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}
module.exports.renderEditForm = async(req, res, next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    let originalImageUrl = listing.image.url.replace("/upload", "/upload/h_300,w_250");
    req.flash("error", "Listing you requested for does not exist !");
    res.render("listings/edit", {listing, originalImageUrl});
}
module.exports.updateListing = async(req, res, next)=>{
    let {id} = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing);
    if(typeof req.file !== "undefined"){
        const url = req.file.path;
        const filename = req.file.filename;
        updatedListing.image = {url, filename};
        await updatedListing.save();
    }
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
}
module.exports.destroyListing = async(req, res, next)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
}