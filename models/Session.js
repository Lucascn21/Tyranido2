const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new Schema(
	{
		_id: {
			type: "String",
		},
		expires: {
			$date: {
				type: "Date",
			},
		},
		session: {
			cookie: {
				originalMaxAge: {
					type: "Number",
				},
				expires: {
					$date: {
						type: "Date",
					},
				},
				secure: {
					type: "Boolean",
				},
				httpOnly: {
					type: "Boolean",
				},
				domain: {
					type: "Mixed",
				},
				path: {
					type: "String",
				},
				sameSite: {
					type: "Boolean",
				},
			},
			isAuth: {
				type: "Boolean",
			},
			user: {
				type: "String",
			},
			sessID: {
				type: "String",
			},
		},
	}
);

module.exports = mongoose.model("Session", sessionSchema);
