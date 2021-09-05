const { encrypt, compare } = require("../helpers/handleBcrypt");
const userModel = require("../models/User");

// POST /register //TODO FINISH THIS CONTROLLER AND DO THE SAME WITH THE REST
exports.register = async (req, res, next) => {
	//Get this from the body
	const { email, username, password } = req.body;

	//TODO Handle if the mail exists
	let user = (await userModel.findOne({ email })) || (await userModel.findOne({ username }));

	if (user) {
		req.session.context = "user/email already exist";
		return res.redirect("/");
	}

	//build our model from the body
	user = new userModel({
		username,
		email,
		password: await encrypt(password, 12), //envear el salt
	});

	try {
		await user.save();
		req.session.context = "successfulRegister";
		res.redirect("/dashboard");
	} catch (error) {
		req.session.context = "errorsInTheForm";
		return res.redirect("/");
	}
};


// POST /login
exports.login = async (req, res, next) => {
	const { username, password } = req.body;
	const user = await userModel.findOne({ username });
	try {
		if (!user) {
			res.status(409);
			req.session.context = "failedLoginWrongCredentials";
			return res.redirect("/register");
		}
		const passwordMatches = await compare(password, user.password);
		if (passwordMatches) {
			res.status(200);
			req.session.context = "SuccesfulLogin";
			return res.redirect("/dashboard");
		} else {
			res.status(409);
			req.session.context = "failedLoginWrongCredentials";
			return res.redirect("/login");
		}
	} catch (error) {
		req.session.context="401";
		next(createError(401));
	}

};
