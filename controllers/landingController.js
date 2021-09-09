// GET landing
exports.index = async (req, res, next) => {
	return res.render("landing", { context: res.locals.context });
};
