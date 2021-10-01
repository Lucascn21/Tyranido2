const { encrypt, compare } = require("../helpers/handleBcrypt");
const createError = require("http-errors");
//Models
const userModel = require("../models/User");

// POST /auth/register
exports.register = async (req, res, next) => {
	//Get this from the body
	const { email, username, password } = req.body;

	let user = (await userModel.findOne({ email })) || (await userModel.findOne({ username }));
	if (user) {
		req.session.message = "user/email already exist";
		req.session.alertType = "warning";
		return res.redirect("/register");
	}

	user = new userModel({
		username,
		email,
		password: await encrypt(password, parseInt(process.env.HASH_SALT)),
		liked:[]
	});

	try {
		await user.save();
		req.session.message = "Register successful";
		req.session.alertType = "success";
		res.redirect("/login");
	} catch (error) {
		console.dir(error);
		req.session.alertType = "danger";
		req.session.message = `Form error`;
		return res.redirect("/");
	}
};

// POST /auth/login
exports.login = async (req, res, next) => {
	const { username, password } = req.body;
	const user = await userModel.findOne({ username });
	try {
		if (!user) {
			res.status(409);
			req.session.message = "Login failed - Wrong credentials";
			req.session.alertType = "warning";
			return res.redirect("/login");
		}
		const passwordMatches = await compare(password, user.password);
		if (passwordMatches) {
			res.status(200);
			//Sess
			req.session.message = "Login successful";
			req.session.alertType = "success";
			req.session.isAuth = true;
			req.session.owner = username;
			req.session.searchResult=[];
			return res.redirect("/lookup");
		} else {
			res.status(409);
			req.session.message = `Login failed - Wrong credentials`;
			req.session.alertType = "warning";
			return res.redirect("/login");
		}
	} catch (error) {
		req.session.message = `Forbidden 401`;
		req.session.alertType = "danger";
		return next(createError(401));
	}
};

// POST /auth/logout
exports.logout = async (req, res, next) => {
	if (req.session.isAuth) {
		req.session.destroy();
		res.clearCookie("connect.sid"); // clean up!
		return res.redirect("/");
	} else {
		req.session.message = `Couldnt logout 500`;
		req.session.alertType = "danger";
		return next(createError(500));
	}
};
