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
			{ username: "test1234", password: await encrypt("test1234", parseInt(process.env.HASH_SALT))},
			{ upsert: true, new: true, runValidators: true },
			function (err, doc) {
				if (err) console.dir(`error creando cuenta de prueba ${err}`);
				if (doc) console.dir("datos de cuenta de prueba creados/actualizados con exito test1234:test1234");
			}
		);
	} catch (err) {
		console.log("Failed to connect to MongoDB", err);
		console.log("Check if MongoDB's service is running");
		process.exit(1);
	}
};

const getLikedByUser = async (username) => {
	console.dir(`Getting ${username}'s liked content`);
	try {
		const user = await userModel.findOne({ username }, "liked").lean();
		let result = Array.from(user.liked).map((likedElement) => likedElement.imdbId);
		console.dir('result')
		console.dir(result)
		return (result = result.filter((e) => e));
	} catch (err) {
		console.log(`Error getting ${username}'s liked content - ${err}`);
		console.error(err);
	}
};

TODO:this
const getMongoID = async (imdbID, username) => {
	try {/*
		const user = await userModel.findOne({ 'username':username }).lean();
		
		console.dir("user");
		console.dir(user._id);
		console.dir("user.liked");
		console.dir(user.liked);
		const user2 = await userModel.findOne({ '_id':user._id }).lean();
		user2.liked;
		console.dir("user2.liked");
		console.dir(user2.liked);*/
		return "todo";
	} catch (err) {
		console.log(`Error deleting ${username}'s disliked content - ${err}`);
		console.error(err);
	}
};

module.exports = { connectDB, getLikedByUser, getMongoID };
