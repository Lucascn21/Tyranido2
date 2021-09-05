// GET
exports.index = async (req, res, next) => {
	return res.render("login", { context: req.session.context });
};
