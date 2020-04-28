

var mongoose=require("mongoose");
//schema
var campgroundschema=new mongoose.Schema({
	name:String,
	image:String,
	description:String,
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"user"
		},
		username:String
	},
	comments:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"comment"
		}
	]
});

module.exports = mongoose.model("campground",campgroundschema);

