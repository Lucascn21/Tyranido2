// GET lookup
exports.index = async (req, res, next) => {
	return res.render("lookup", { context: res.locals.context, searchResult:req.session.searchResult});
};
