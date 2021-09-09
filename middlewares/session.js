// sessionAuthMW
const isAuth = (req, res, next) => {
	if (req.session.isAuth) {
		next();
	} else {
		res.status(401);
		req.session.context = "Not Authorized";
		res.redirect("/");
	}
};

//Mw that handles the user trying to register/login while already logged in
const isNotAuth = (req, res, next) => {
	if (req.session.isAuth) {
		res.status(401);
		req.session.context = "AlreadyLoggedIn";
		res.redirect("/dashboard");
	} else {
		next();
	}
};

module.exports = { isAuth, isNotAuth };
