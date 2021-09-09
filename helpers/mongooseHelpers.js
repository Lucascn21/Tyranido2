const monitorMongoose = (mongoose) => {
	// If the connection throws an error
	mongoose.connection.on("error", function (err) {
		console.log("Mongoose default connection error: " + err);
		process.exit(0);
	});

	// When the connection is disconnected
	mongoose.connection.on("disconnected", function () {
		console.log("Mongoose default connection disconnected");
		process.exit(0);
	});
	// If the Node process ends, close the Mongoose connection
	process.on("SIGINT", function () {
		mongoose.connection.close(function () {
			console.log("Mongoose default connection disconnected through app termination");
			process.exit(0);
		});
	});
};


module.exports={monitorMongoose}
