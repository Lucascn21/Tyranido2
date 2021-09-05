

// POST /register //TODO FINISH THIS CONTROLLER AND DO THE SAME WITH THE REST
exports.error = async (err, req, res, next) => {


		// set locals, only providing error in development
		res.locals.message = err.message;
		res.locals.error = req.app.get("env") === "development" ? err : {};
	
		// render the error page
		res.status(err.status || 500);

	res.render("error", { context: req.session.context });

};
