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
				t: req.body.titulo,
				s: req.body.searchQuery,
				type: req.body.tipo, //	movie, series, episode, game
				y: req.body.anio,
				page: req.body.page,
				apikey: "40921d99",
			},
		})
		.then(function (response) {
			//Si recibo respuesta, continuo, sino rechazo la promesa    
            console.dir("body req")
            //console.dir(req.body)
            console.dir("axios response")
            //console.dir(response)
            console.dir(response.data.Search)
		})
		.catch(function (error) {
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				console.log(`Mensaje de Error Response: ${error.response}`);
				msjError = error.response;
			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				console.log(`Mensaje de Error Req: ${error.request}`);
				msjError = error.request;
			} else {
				// Something happened in setting up the request that triggered an Error
				console.log(`Mensaje de Error: ${error.message}`);
				msjError = error.message;
			}
			req.session.message = `Axios rip`;
			req.session.alertType = "danger";
			next(createError(500));
			//res.render("home", { error: msjError }); //Sin este if, node me da Unhandled promise rejection cuando recibo no recibo data pero si msjerror
		})
		.finally(function () {
            if(response.data.Search){console.dir('resultados exitosos')}
			/*

			//Si la data es un array de datos, paso la lista a la vista y la cantidad de resultados (es solo para la alerta que muestra la cantidad de resultados)
			if (Array.isArray(data)) {
                console.dir('recibi array')
			} else {
                console.dir('recibi una pelicula')
				res.render("pelicula", { pelicula: 'asd' });
			}
*/
		});
};
exports.game = async (req, res, next) => {};
