const userModel = require("../models/User");
const createError = require("http-errors");
const { getLikedByUser, getMongoID } = require("../helpers/database");
// GET user
exports.index = async (req, res, next) => {
	return res.render("user", { context: res.locals.context });
};

exports.like = async (req, res, next) => {
	console.dir("req");
	//console.dir(req);
	console.dir(req.body);
	console.dir(req.session.owner);
	let username = req.session.owner;
	let user = await userModel.findOne({ username });
	//const user2 = await userModel.findOne({ username }, { "liked.imdbId": "tt0940530" });
	//const user3 = await userModel.findOne({ "liked.userId": "tt0940530", username });

	try {
		let likedContent = await getLikedByUser(username);
		if (likedContent.includes(req.body[`imdbID`])) {
			//req.body[`imdbID`]
			//req.session.owner
			console.dir(user.liked)
			user.liked.pull({	
				_id: req.body[`imdbID`]
			});

	
		
			
		} else {
			console.dir("like");
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
	return res.redirect("/lookup");
};
