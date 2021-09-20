// GET user
exports.index = async (req, res, next) => {
	return res.render("user", { context: res.locals.context});
};
