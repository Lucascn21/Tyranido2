const axios = require("axios");

// POST /search/movie
exports.search = async (req, res, next) => {
	axios
		.get("https://www.omdbapi.com/", {
			params: {
				// i: 'tt3896198', //ID IMDb (REQUERIDO ESTE O t PARA BUSQUEDAS ESPECIFICAS)
				//t: 'of', //retorna el primer titulo que contiene esta string (REQUERIDO ESTE O i PARA BUSQUEDAS ESPECIFICAS)
				//s: 'of the', //devuelve array de objetos, tambien una propiedad llamada totalResults. Con 'of' devolvia un error: demasiados resultados. (BUSQUEDAS GENERALES)
				//type:'movie' // movie, series, episode ESPECIFICA SI BUSCAMOS UNA SERIE, PELI O EPISODIO ESPECIFICO
				//y:1992 //anio de estreno/release de la serie, pelicula o episodio.
				//page: 1 //Numero de pagina
				i: req.body.imdb,
				t: req.body.title,
				s: req.body.searchQuery,
				type: req.body.type, //	movie, series, episode, game
				y: req.body.year,
				page: req.body.page,
				apikey: process.env.API_KEY ,
			},
		})
		.then(function (response) {
			if (!response.data.Error) {
				req.session.searchResult = response.data.Search;
				req.session.resultsAmount = response.data.Search.length;
				req.session.totalResults = response.data.totalResults;
				req.session.searchResult.forEach((element) => {
					if (element.Poster == "N/A") element.Poster = "/images/nopicture.png";
				});
			} else {
				req.session.searchResult = [];
				req.session.resultsAmount = 0;
			}
		})
		.catch(function (err) {
			if (err.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				console.log(`Mensaje de Error Response: ${err.response}`);
			} else if (err.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				console.log(`Mensaje de Error Req: ${err.request}`);
			} else {
				// Something happened in setting up the request that triggered an Error
				console.log(`Mensaje de Error: ${err.message}`);
			}

			throw new Error(err);
		})
		.finally(function () {
			let { searchResult, resultsAmount, totalResults } = req.session;
			if (resultsAmount) {
				res.status(302);
				req.session.message = `${resultsAmount} results out of ${totalResults}`;
				req.session.alertType = "success";
				return res.redirect("dashboard");
			} else {
				res.status(204);
				req.session.message = "No results";
				req.session.alertType = "warning";
				req.session.searchResult = [];
				return res.redirect("dashboard");
			}
		});
};
exports.game = async (req, res, next) => {};
