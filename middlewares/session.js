// sessionAuthMW
const isAuth = async (req, res, next) => {
	if (req.session.isAuth) {
		next();
	} else {
		res.status(401);
		req.session.message = "Not Authorized";
		req.session.alertType = "warning";
		res.redirect("/login");
	}
};

//Mw that handles the user trying to register/login while already logged in
const isNotAuth = (req, res, next) => {
	if (req.session.isAuth) {
		res.status(401);
		req.session.message = "AlreadyLoggedIn";
		req.session.alertType = "warning";
		res.redirect("/lookup");
	} else {
		next();
	}
};

module.exports = { isAuth, isNotAuth };
