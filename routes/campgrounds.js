const express = require('express');

const Campground = require('../models/campground');

const router = express.Router();

router.get("/", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if(err) console.log(err);
        else res.render("campgrounds/index", {campgrounds: allCampgrounds,});
    });
});

router.post("/", isLoggedIn, function(req, res) {
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const newCampground = {name: name, image: image, description: desc};
    Campground.create(newCampground, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
        if(err) {
            console.log(err)
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

module.exports = router;