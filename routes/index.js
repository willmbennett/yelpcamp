var express 	= require("express"),
	router 		= express.Router(),
	passport 	= require("passport");

// Models
var User 		= require("../models/user");

// Route Route
router.get('/', function(req, res){
	res.render('landing');
});

// =====================
// AUTH ROUTES
// =====================

// Show the register form
router.get("/register", function(req,res){
	res.render("register");
})

//Handle sign-up logic
router.post("/register", function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err,user){
		if(err){
			req.flash("error", "Error: " + err.message);
			return res.render('register')
		} else {
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to YelpCamp " + user.username);
				res.redirect("/campgrounds");
			});
		}
	});
});

// Show login form
router.get("/login", function(req,res){
	res.render("login");
})

// Handling login logic
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login",
		successFlash: 'Welcome!',
		failureFlash: 'Error: Invalid username or password.'
	}), function(req,res){
});

// Logout route
router.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "Logged Out!");
	res.redirect("/campgrounds");
});

module.exports = router;