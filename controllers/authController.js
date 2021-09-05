const { encrypt, compare } = require("../helpers/handleBcrypt");
const userModel = require("../models/User");

// POST /register //TODO FINISH THIS CONTROLLER AND DO THE SAME WITH THE REST
exports.register = async (req, res, next) => {
	//Get this from the body
	const { email, username, password } = req.body;

	//TODO Handle if the mail exists
	let user = (await userModel.findOne({ email })) || (await userModel.findOne({ username }));

	if (user) {
		req.session.context = "failedRegister";
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
		console.dir(error)
		return res.redirect("/error");
	}
	// Password must not be empty.
	/*
	try {
		// Save into the data base
		user = await user.save({ fields: ["username", "password", "salt"] });
		req.flash("success", "User created successfully.");
		if (req.loginUser) {
			res.redirect("/users/" + user.id); //Lo llevo a donde corresponde si esta logueado(creo)
		} else {
			res.redirect("/login"); // Redirection to the login page
		}
	} catch (error) {
		if (error instanceof Sequelize.UniqueConstraintError) {
			req.flash("error", `User "${username}" already exists.`);
		res.send('Login') //Tiene que ser un render con el error
		} else if (error instanceof Sequelize.ValidationError) {
			req.flash("error", "There are errors in the form:");
			error.errors.forEach(({ message }) => req.flash("error", message));
			res.send('Login') //Tiene que ser un render con el error
		} else {
			next(error);
		}
	}
    */
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
		console.dir(error)
		return res.redirect("/error");
	}

};
