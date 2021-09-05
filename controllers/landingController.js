// GET
exports.index = async (req, res, next) => {
	return res.render("landing", { context: req.session.context });
};
