var express= require("express");
var router=express.Router();
var passport=require("passport");
var user=require("../models/user");


router.get("/",function(req, res){
	res.render("landing");
});

//show register form
router.get("/register", function(req, res){
	res.render("register");
});

//handle signup logic
router.post("/register", function(req, res){
	var newuser=new user({username:req.body.username});
	user.register(newuser,req.body.password, function(err, user){
		if(err){
			req.flash("error",err.message);
		    return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success","Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});


//show login form
router.get("/login", function(req, res){
	res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect:"/login"
									 }),
		 function(req, res){
	
});

//logout routes
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success","Logged you out!!");
	res.redirect("/campgrounds");
	
});

function isloggedin(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be Logged in to do that!!");
	res.redirect("/login");

}

module.exports=router;