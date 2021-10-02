const userModel = require("../models/User");
const createError = require("http-errors");
const { getLikedByUser } = require("../helpers/database");
// GET user
exports.index = async (req, res, next) => {
	return res.render("user", { context: res.locals.context });
};

exports.like = async (req, res, next) => {
	let username = req.session.owner;
	let user = await userModel.findOne({ username });
	try {
		let likedContent = await getLikedByUser(username);
		if (likedContent.includes(req.body[`imdbID`])) {
			user.liked.pull({
				_id: req.body[`imdbID`],
			});
		} else {
			user.liked.push({
				_id: req.body[`imdbID`],
				resultType: req.body[`Type`],
			});
		}
		await user.save();
	} catch (error) {
		console.error(error);
		req.session.message = `Error 500`;
		req.session.alertType = "danger";
		return next(createError(401));
	}
	req.session.likedContent = await getLikedByUser(req.session.owner);
	req.session.searchResult.forEach((element) => {
		if (element.Poster == "N/A") element.Poster = "/images/nopicture.png";
		if (req.session.likedContent.includes(element.imdbID)) {
			element.liked = true;
		} else {
			element.liked = false;
		}
	});
	return res.redirect("/lookup");
};
