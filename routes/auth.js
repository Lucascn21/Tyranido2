var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.create);

router.post("/login", function (req, res, next) {
	res.send('Login')
});

module.exports = router;
