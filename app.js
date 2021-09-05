/*jshint esversion: 6 */
require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoDBStore = require('connect-mongodb-session')(session);

//Helpers
const { monitorMongoose } = require("./helpers/mongooseHelpers");
//Models


//Routers
const landingRouter = require("./routes/landing");
const loginRouter = require("./routes/login");
const authRouter = require("./routes/auth");
const dashboardRouter = require("./routes/dashboard");
const errorRouter = require("./routes/error");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);


const store = new MongoDBStore({
	uri: 'mongodb://localhost:27017/Sessions',//Envear quizas
	collection: 'Sessions'
  });

  // Catch errors
  store.on('error', function(error) {
	console.log(error);
  });

//Session
app.use(session({
	secret: 'This is a secret', //envear
	resave: false,
	saveUninitialized: false,
	cookie: {
	  maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
	},
	store: store
  }));


//DB
mongoose.connect("mongodb://localhost:27017/Users").then((res) => { //Envear quizas
	monitorMongoose(mongoose);
	console.log("mongodb, conectado");
});


  

//	
app.use("/", landingRouter);
app.use("/login", loginRouter);
app.use("/auth", authRouter);
app.use("/dashboard", dashboardRouter);
app.use("/error", errorRouter);



console.dir(`https://localhost:3000`);
module.exports = app;


