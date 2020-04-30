var express= require("express");
var router=express.Router();
var campground= require("../models/campgrounds");
var comment= require("../models/comment");

router.get("/campgrounds/:id/comments/new", isloggedin,function(req, res){
	//find campground by id
	campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			res.render("comments/new",{campground:campground});
		}
	});
	
});


router.post("/campgrounds/:id/comments",isloggedin,function(req, res){
	//lookup campgrounds using id
	campground.findById(req.params.id,function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
		comment.create(req.body.comment,function(err, comment){
			if(err){
				req.flash("error","Something went wrong");
				console.log(err);
			}else{
				//add username and id to comment
				comment.author.id=req.user._id;
				comment.author.username=req.user.username;
				
				//save comment
				comment.save();
				campground.comments.push(comment);
				campground.save();
				req.flash("success","Successfully added a comment!!");
				res.redirect("/campgrounds/" + campground._id);
			}
			
		});
		}
	});
	// cretae new cmnt
	// connect new cmnt to campground
	//redirect campground show page
});


//comment edit
router.get("/campgrounds/:id/comments/:comment_id/edit",checkcommentownership, function(req, res){
	comment.findById(req.params.comment_id, function(err, foundcomment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit",{campground_id:req.params.id, comment:foundcomment,campground:campground});
		}
	});
	
});

//comment update
router.put("/campgrounds/:id/comments/:comment_id", checkcommentownership,function(req, res){
	
	comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function(err, updatecomment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/" + campground.id);
		}
	});
});


//comments destroy router
router.delete("/campgrounds/:id/comments/:comment_id", checkcommentownership, function(req, res){
	//findbyid and remove
	comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success","Comment successfully deleted!!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	
});



//middleware
function isloggedin(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Please Login First!");
	res.redirect("/login");

}


function checkcommentownership(req, res, next){
	
	if(req.isAuthenticated()){
		
		comment.findById(req.params.comment_id,function(err, foundcomment){
		if(err){
			req.flash("error","Campground not found");
			res.redirect("back");
		}else{
			//does user own the comment?
			if(foundcomment.author.id.equals(req.user._id)){
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