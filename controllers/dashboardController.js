// GET
exports.index = async (req, res, next) => {
	return res.render("dashboard", { context: req.session.context });
};
