/*jshint esversion: 6 */
require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const { v4: uuidv4 } = require("uuid");

//Routers
var htmlRouter = require("./routes/index");

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
	uri: process.env.DB_USERURI,
	collection: process.env.DB_COLLECTION_SESSION,
});

// Catch errors
store.on("error", function (error) {
	console.log(error);
});

//Session
app.use(
	session({
		genid: () => {
			return uuidv4();
		},
		secret: process.env.SESS_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: null,
			httpOnly: true,
			secure: true,
			sameSite: true,
		},
		store: store,
	})
);

// Set local context, clear session context -- from Ethan Brown's book, 'Web Development with Node & Express'
app.use(function (req, res, next) {
	res.locals.message = req.session.message;
	res.locals.alertType = req.session.alertType;
	delete req.session.message;
	delete req.session.alertType;
	next();
});

//Registered routes
app.use("/", htmlRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	req.session.context = "Page not found";
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error", { context: res.locals.context });
});
console.dir(`https://localhost:3000`);
module.exports = app;
