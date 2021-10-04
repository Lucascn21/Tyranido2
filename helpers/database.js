const mongoose = require("mongoose");
const { monitorMongoose } = require("./mongooseHelpers");
const userModel = require("../models/User");
const { encrypt } = require("../helpers/handleBcrypt");

const connectDB = async () => {
	console.dir("Connecting to MongoDB");
	try {
		await mongoose.connect(process.env.DB_USERURI, {});
		monitorMongoose(mongoose);
		console.log("MongoDB connected!!");
		const query = { username: "test1234" };
		userModel.findOneAndUpdate(
			query,
			{ username: "test1234", password: await encrypt("test1234", parseInt(process.env.HASH_SALT)) },
			{ upsert: true, new: true, runValidators: true },
			function (err, doc) {
				if (err) console.dir(`error creating test account${err}`);
				if (doc) console.dir("test account created/updated successfully test1234:test1234");
			}
		);
	} catch (err) {
		console.log("Failed to connect to MongoDB", err);
		console.log("Check if MongoDB's service is running");
		process.exit(1);
	}
};

const getLikedIdByUser = async (username) => {
	try {
		const user = await userModel.findOne({ username }, "liked").lean();
		let result = Array.from(user.liked).map((likedElement) => likedElement._id);
		return (result = result.filter((e) => e));
	} catch (err) {
		console.log(`Error getting ${username}'s liked content - ${err}`);
		console.error(err);
	}
};

const getLikedIdAndType = async (username) => {
	try {
		const user = await userModel.findOne({ username }, "liked").lean();
		let result=Array.from(user.liked);
		return (result = result.filter((e) => e));
	} catch (err) {
		console.log(`Error getting ${username}'s liked content - ${err}`);
		console.error(err);
	}
};

module.exports = { connectDB, getLikedIdByUser, getLikedIdAndType };
