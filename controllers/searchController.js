const axios = require("axios");

// POST /search
exports.search = async (req, res, next) => {
	//This code is repeated in other controllers, for the sake of time i will leave the refactoring for my next remaster/remake of this project
	axios
		.get("https://www.omdbapi.com/", {
			params: {
				i: req.body.imdb, // i: 'tt3896198' ID IMDb
				t: req.body.title, //retorna el primer titulo que contiene esta string
				s: req.body.searchQuery,
				type: req.body.type, //	movie, series, episode, game
				y: req.body.year,
				page: req.body.page,
				apikey: process.env.API_KEY,
			},
		})
		.then(function (response) {
			if (!response.data.Error) {
				req.session.searchResult = response.data.Search;
				req.session.resultsAmount = response.data.Search.length;
				req.session.totalResults = response.data.totalResults;
				req.session.searchResult.forEach((element) => {
					if (element.Poster == "N/A") element.Poster = "/images/nopicture.png";
					//Parsing ratings
					if (element.Source == "Internet Movie Database") {
						//Divido el string, en res[0] tengo el score actual, en res[1] tengo el valor total sobre el cual se divide
						let res = element.Value.split("/");
						element.Value = Math.round((res[0] / res[1]) * 100);
					} else if (element.Source == "Rotten Tomatoes") {
						let res = element.Value.split("%");
						element.Value = parseInt(res[0]);
					} else if (element.Source == "Metacritic") {
						element.Value = parseInt(element.Value);
					} else {
						console.error("Unhandled rating: " + element.Value);
					}
				});
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
			let { resultsAmount, totalResults } = req.session;
			if (resultsAmount) {
				res.status(302);
				req.session.message = `${resultsAmount} results out of ${totalResults}`;
				req.session.alertType = "success";
				return res.redirect("lookup");
			} else {
				res.status(204);
				req.session.message = "No results";
				req.session.alertType = "warning";
				req.session.searchResult = [];
				return res.redirect("lookup");
			}
		});
};
