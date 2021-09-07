// GET
exports.index = async (req, res, next) => {
	//TODO: Further testing on this default
	return res.render("landing", { context: req.session.context ='' });
};
