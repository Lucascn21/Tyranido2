const userModel = require("../models/User");
const createError = require("http-errors");
const { getLikedIdByUser, getLikedIdAndType } = require("../helpers/database");
// GET user
exports.index = async (req, res, next) => {
	console.dir("userController session")
	console.dir(await getLikedIdAndType(req.session.owner))
	return res.render("user", { context: res.locals.context });
};

exports.like = async (req, res, next) => {
	let username = req.session.owner;
	let user = await userModel.findOne({ username });
	try {
		let likedContent = await getLikedIdByUser(username);
		if (likedContent.includes(req.body[`imdbID`])) {
			user.liked.pull({
				_id: req.body[`imdbID`],
			});
		} else {
			user.liked.push({
				_id: req.body[`imdbID`],
				resultType: req.body[`Type`],
				poster: req.body[`Poster`],
			});
		}
		await user.save();
	} catch (error) {
		console.error(error);
		req.session.message = `Error 500`;
		req.session.alertType = "danger";
		return next(createError(401));
	}
	req.session.likedContent = await getLikedIdByUser(req.session.owner);
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
