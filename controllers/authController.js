const { encrypt, compare } = require("../helpers/handleBcrypt");
//Models
const userModel = require("../models/User");

// POST /auth/register
exports.register = async (req, res, next) => {
	//Get this from the body
	const { email, username, password } = req.body;

	let user = (await userModel.findOne({ email })) || (await userModel.findOne({ username }));
	if (user) {
		req.session.context = "user/email already exist";
		return res.redirect("/register");
	}

	//build our model from the body
	user = new userModel({
		username,
		email,
		password: await encrypt(password, parseInt(process.env.HASH_SALT)),
	});

	try {
		await user.save();
		req.session.context = "successfulRegister"; //TODO: Maybe, login on register.
		res.redirect("/login");
	} catch (error) {
		req.session.context = "errorsInTheForm";
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
			req.session.context = "failedLoginWrongCredentials";
			return res.redirect("/login");
		}
		const passwordMatches = await compare(password, user.password);
		if (passwordMatches) {
			res.status(200);
			req.session.context = "SuccesfulLogin";
			req.session.isAuth = true;
			req.session.user = user.id;
			return res.redirect("/dashboard");
		} else {
			res.status(409);
			req.session.context = "failedLoginWrongCredentials";
			return res.redirect("/login");
		}
	} catch (error) {
		req.session.context = "401";
		next(createError(401));
	}
};
