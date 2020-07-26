var express=require("express");
var app=express();
var bodyparser= require("body-parser");
var mongoose=require("mongoose");
var flash=require("connect-flash");
var dotenv = require("dotenv");
dotenv.config();

var comment= require("./models/comment");
var seeddb = require("./seeds");
var campground = require("./models/campgrounds");
var passport=require("passport");
var localstrategy=require("passport-local");
var methodoverride= require("method-override");
var user=require("./models/user");

var commentroutes=require("./routes/comments"),
	campgroundroutes=require("./routes/campgrounds"),
	indexroutes=require("./routes/index");
	
mongoose.connect(process.env.CONNECTIONSTRING,{
	useNewUrlParser :true,
	useUnifiedTopology: true
}).then(() =>{
	console.log("connected to db!!!");
}).catch(err =>{
	console.log("ERROR:", err.message);
});

app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodoverride("_method"));
app.use(flash());
//seeddb(); //seed the data base


//passport config
app.use(require("express-session")({
	secret:"once again rusty wins cutest dogs",
	resave:false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentuser = req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	
	next();
});

app.use(indexroutes);
app.use(campgroundroutes);
app.use(commentroutes);



app.listen(process.env.PORT|| 3000, process.env.IP,function(){
	console.log("server has started running");
});
