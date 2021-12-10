const axios = require("axios");
const { getLikedIdByUser } = require("../helpers/database");

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
		.then(async function (response) {
			if (!response.data.Error) {
				req.session.searchResult = response.data.Search;
				req.session.resultsAmount = response.data.Search.length;
				req.session.totalResults = response.data.totalResults;
				req.session.likedContent = await getLikedIdByUser(req.session.owner);
				req.session.searchResult.forEach((element) => {
					console.dir(element.Poster)
					if (element.Poster == "N/A") element.Poster = "/images/nopicture.png";
					if (req.session.likedContent.includes(element.imdbID)) {
						element.liked = true;
					} else {
						element.liked = false;
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
