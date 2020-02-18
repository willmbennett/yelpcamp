var middlewareObj = {};

// Models
var Campground 	= require("../models/campground"),
	Comment 	= require("../models/comment");

// Check if user is logged in
middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("/login");
	}
};

// Check if user owns campground
middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		// Find and update the correct campground
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", "Campground not found");
				res.redirect("back");
			} else {
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You do not have permission to do that");
					res.redirect("back");
				}
			}
		});
		
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

// Check if user owns comment
middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		// Find and update the correct comment
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				req.flash("error", "Comment not found");
				res.redirect("back");
			} else {
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You do not have permission to do that");
					res.redirect("back");
				}
			}
		});
		
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

module.exports = middlewareObj;