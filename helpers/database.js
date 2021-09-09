
const mongoose = require("mongoose");
const { monitorMongoose } = require("./mongooseHelpers");
const connectDB = async () => {
    console.dir('Connecting to MongoDB')
	try {
		await mongoose.connect(process.env.DB_USERURI, {});
        monitorMongoose(mongoose);
		console.log("MongoDB connected!!");
	} catch (err) {
		console.log("Failed to connect to MongoDB", err);
		console.log("Check if MongoDB's service is running");
		process.exit(1);
	}
};

module.exports = { connectDB };