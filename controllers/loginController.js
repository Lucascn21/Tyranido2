// GET login
exports.index = async (req, res, next) => {
	return res.render("login", { context: res.locals.context});
};
