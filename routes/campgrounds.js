var express= require("express");
var router=express.Router();
var campground=require("../models/campgrounds");

//INDEX ROUTE
router.get("/campgrounds",function(req,res){
	//get all the campgrounds from db...then render them
	campground.find({}, function(err, allcampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:allcampgrounds,currentuser:req.user});
		}
	});
	
});

//CREATE ROUTE
router.post("/campgrounds",isloggedin, function(req, res){
	//get data from form and add to campground array
	var name=req.body.name;
	var image=req.body.image;
	var desc=req.body.description;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var newcampground={name:name,image:image, description:desc,author:author}
	
	//create a newcampground and save to db
	campground.create(newcampground,function(err,newlycreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
});


//NEW ROUTE
router.get("/campgrounds/new",isloggedin, function(req, res){
	res.render("campgrounds/new");
});

//SHOW ROUTE
router.get("/campgrounds/:id",function(req,res){
	//find campground with given id and show all its info
	campground.findById(req.params.id).populate("comments").exec(function(err, foundcampground){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show",{campground:foundcampground});
		}
	});
	
	
});


//edit  campground route
router.get("/campgrounds/:id/edit",checkcampgroundownership, function(req, res){
	
    	campground.findById(req.params.id,function(err, foundcampground){
			
			
				res.render("campgrounds/edit",{campground:foundcampground});
	});
});


//update campground route
router.put("/campgrounds/:id",checkcampgroundownership, function(req, res){
	//find and updatte the crrct cg
	campground.findByIdAndUpdate(req.params.id,req.body.campground, function(err,updatedcampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	//redirect somewhere
});

//DESTROY ROUTE
router.delete("/campgrounds/:id",checkcampgroundownership, function(req, res){
	campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});





//middlewares
function isloggedin(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be Logged in to do that!!");
	res.redirect("/login");
}


function checkcampgroundownership(req, res, next){
	
	if(req.isAuthenticated()){
		
		campground.findById(req.params.id,function(err, foundcampground){
		if(err){
			req.flash("error","Campground not found");
			res.redirect("back");
		}else{
			//does user own the campground?
			if(foundcampground.author.id.equals(req.user._id)){
				next();
			}else{
				req.flash("error","you don't have permission to do that!!");
				res.redirect("back");
			}
			
		}
	});
		
	}else{
		req.flash("error", "You need to be logged in to do that!!")
		res.redirect("back");
	}
	
}


module.exports=router;	