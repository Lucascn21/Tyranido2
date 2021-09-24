const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeSubschema = new Schema({
	imdbId: {
		type: String,
	},
	resultType: {
		type: String,
	},
});

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	liked: [likeSubschema],
});

module.exports = mongoose.model("User", userSchema);
