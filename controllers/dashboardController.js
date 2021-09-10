// GET dashboard
exports.index = async (req, res, next) => {
	return res.render("dashboard", { context: res.locals.context , usernamelocal:res.locals.usernamelocal});
};
