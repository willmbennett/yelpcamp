var express 		= require('express'),
	app 			= express(),
    bodyParser 		= require("body-parser"),
    mongoose 		= require("mongoose"),
	passport 		= require("passport"),
	LocalStrategy 	= require("passport-local"),
	methodOverride  = require("method-override"),
	flash 			= require("connect-flash");

// Models + Seed
var	Campground  	= require("./models/campground"),
	Comment  		= require("./models/comment"),
	User  			= require("./models/user"),
	seedDB  		= require("./seeds");

// Routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

// Connect to MongoDB
const url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(url, { 
	useNewUrlParser: true, 
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB')
}).catch(err => {
	console.log(err);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB(); // Seed the DB

// Passport Config
app.use(require("express-session")({
	secret: "Once again Will wins cutest in the world",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Pass user middleware
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// Routes
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

// Catch All Route
app.get('*', function(req, res){
	res.redirect('/');
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});