//Opera-specific hack because img's would not have the desired height in least 9 out of 10 images
let isOpera = navigator.userAgent.match(/Opera|OPR\//) ? true : false;
if (isOpera) {
	let imgs = Array.from(document.getElementsByClassName("card-img-top"));
	imgs.forEach((element) => {
		element.classList.toggle("opera");
		element.clientHeight = 100;
	});
}

//IMDB rating functionality
(function (d, s, id) {
	var js,
		stags = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {
		return;
	}
	js = d.createElement(s);
	js.id = id;
	js.src = "https://ia.media-imdb.com/images/G/01/imdb/plugins/rating/js/rating.js";
	stags.parentNode.insertBefore(js, stags);
})(document, "script", "imdb-rating-api");

