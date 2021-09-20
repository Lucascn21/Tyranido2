const axios = require("axios");
// GET lookup
exports.index = async (req, res, next) => {
	return res.render("lookup", { context: res.locals.context, searchResult: req.session.searchResult });
};

exports.movie = async (req, res, next) => {
	axios
		.get("https://www.omdbapi.com/", {
			params: {
				// i: 'tt3896198', //ID IMDb (REQUERIDO ESTE O t PARA BUSQUEDAS ESPECIFICAS)
				//t: 'of', //retorna el primer titulo que contiene esta string (REQUERIDO ESTE O i PARA BUSQUEDAS ESPECIFICAS)
				//s: 'of the', //devuelve array de objetos, tambien una propiedad llamada totalResults. Con 'of' devolvia un error: demasiados resultados. (BUSQUEDAS GENERALES)
				//type:'movie' // movie, series, episode ESPECIFICA SI BUSCAMOS UNA SERIE, PELI O EPISODIO ESPECIFICO
				//y:1992 //anio de estreno/release de la serie, pelicula o episodio.
				//page: 1 //Numero de pagina
				i: req.params.imdbID,
				type: "movie", //	movie, series, episode, game
				apikey: process.env.API_KEY,
			},
		})
		.then(function (response) {
			//console.dir(response.data)
			if (!response.data.Error) {
				console.dir(response.data);
				req.session.movie = response.data;

				req.session.movie.Ratings.forEach((element) => {
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
				//This makes sure EJS doesnt show N/A or Api data in the view
				//console.dir(req.session.movie)
				for (data in req.session.movie) {
					if (req.session.movie[data] == "N/A") {
						console.dir("true");
						delete req.session.movie[data];
				
					}
				}
			
		

				//console.dir(req.session.movie)
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
			let { movie } = req.session;
			console.dir(movie);
			if (movie) {
				res.status(302);
				req.session.message = `Movie found`;
				req.session.alertType = "success";
				console.dir(movie.Ratings);
				return res.render("result", { context: res.locals.context, movie: movie });
			} else {
				res.status(204);
				req.session.message = "Movie not found";
				req.session.alertType = "warning";
				req.session.searchResult = [];
				//return res.redirect("lookup");
			}
		});
};
exports.game = async (req, res, next) => {};
exports.series = async (req, res, next) => {};
