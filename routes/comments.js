var express = require("express"),
	router 	= express.Router({mergeParams: true});

// Models
var Campground = require("../models/campground"),
	Comment = require("../models/comment"),
	middleware = require("../middleware");

// Comments New
router.get("/new", middleware.isLoggedIn, function(req,res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
				console.log(err);
			} else {
				res.render("comments/new",{campground: foundCampground});
			}
	});
});

// Comments Create
router.post("/", middleware.isLoggedIn, function(req,res){
	// lookup campground using ID
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
				console.log(err);
				res.redirect("/campgrounds");
			} else {
				// create new comment
				Comment.create(req.body.comment, function(err,comment){
					if(err){
						req.flash("error", "Something went wrong");
						console.log(err);
					} else {
						// Add username and id to comment
						comment.author.id = req.user._id;
						comment.author.username = req.user.username;
						// Save Comment
						comment.save();
						// connect new comment to campground
						foundCampground.comments.push(comment);
						foundCampground.save();
						// redirect campground show page
						req.flash("success", "Comment added!");
						res.redirect("/campgrounds/" + foundCampground._id);
					}
				});
			}
	});
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back")
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

// COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment updated");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// Middleware

module.exports = router;