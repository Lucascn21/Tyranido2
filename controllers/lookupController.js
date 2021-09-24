const axios = require("axios");

// GET lookup
exports.index = async (req, res, next) => {
	return res.render("lookup", { context: res.locals.context, searchResult: req.session.searchResult });
};

exports.movie = async (req, res, next) => {
	getDataByIdAndType(req.params.imdbID, "movie", req, res);
};

exports.game = async (req, res, next) => {
	getDataByIdAndType(req.params.imdbID, "game", req, res);
};
exports.series = async (req, res, next) => {
	getDataByIdAndType(req.params.imdbID, "series", req, res);
};
//type: game, series, movie
const getDataByIdAndType = async (imdbID, type, req, res) => {
	axios
		.get("https://www.omdbapi.com/", {
			params: {
				i: imdbID,
				type: type,
				apikey: process.env.API_KEY,
			},
		})
		.then(function (response) {
			if (!response.data.Error) {
				req.session.result = response.data;
				req.session.result.Ratings.forEach((element) => {
					//Parsing ratings cause i need a value from 0 to 100 for the frontend
					if (element.Source == "Internet Movie Database") {
						let res = element.Value.split("/");
						element.Value = Math.round((res[0] / res[1]) * 100);
					} else if (element.Source == "Rotten Tomatoes") {
						let res = element.Value.split("%");
						element.Value = parseInt(res[0]);
					} else if (element.Source == "Metacritic") {
						element.Value = parseInt(element.Value);
					} else {
						console.error("Unhandled rating: " + element.Value );
					}
				});
				//This makes sure EJS doesnt show N/A in the view and sets up a img on the view if theres no
				for (data in req.session.result) {
					if (data == "Poster" && req.session.result[data] == "N/A") req.session.result[data] = "/images/nopicture.png";
					if (req.session.result[data] == "N/A") delete req.session.result[data];
				}
			} else {
				req.session.searchResult = [];
				req.session.resultsAmount = 0;
			}
		})
		.catch(function (err) {
			if (err.response) {
				console.error(`Error Response: ${err.response}`);
			} else if (err.request) {
				console.error(`Error Req: ${err.request}`);
			} else {
				console.error(`Error: ${err.message}`);
			}

			throw new Error(err);
		})
		.finally(function () {
			let { result } = req.session;
			delete req.session.result;
			if (result) {
				res.status(302);
				req.session.message = `${type} found`;
				req.session.alertType = "success";
				return res.render("result", { context: res.locals.context, result: result });
			} else {
				res.status(204);
				req.session.message = `${type} not found`;
				req.session.alertType = "danger";
				req.session.searchResult = [];
				return res.redirect("/lookup");
			}
		});
};
