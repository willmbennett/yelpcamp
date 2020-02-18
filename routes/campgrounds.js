var express = require("express"),
	router	= express.Router();

var Campground = require("../models/campground"),
	middleware = require("../middleware");

// CAMPGROUND INDEX ROUTE
router.get('/', function(req, res){
	// Get all campgrounds from DB
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log(err);
		} else {
			res.render('campgrounds/index',{campgrounds: campgrounds});
		}
	});
});

// CAMPGROUND NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new");
});

// CAMPGROUND CREATE ROUTE
router.post('/', middleware.isLoggedIn, function(req, res){
	//get data from form and add to campgrounds array
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCamp = {
		name: req.body.name, 
		price: req.body.price, 
		image: req.body.image, 
		description: req.body.description,
		author: author
	};
	Campground.create(newCamp, function(err, campground){
			if(err){
				console.log(err);
			} else {
				//redirect back to campgrounds page
				req.flash("success", "Campground created!");
				res.redirect("/campgrounds");
			}
		});
});

// CAMPGROUND SHOW ROUTE
router.get("/:id", function(req,res){
	//Find the campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
				console.log(err);
			} else {
				res.render("campgrounds/show",{campground: foundCampground});
			}
	});
});

// CAMPGROUND EDIT LINK
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
	// Find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			// Redirect to show page
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, req.body.campground, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			// Redirect to show page
			res.redirect("/campgrounds/");
		}
	});
});

module.exports = router;