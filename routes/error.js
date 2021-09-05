var express = require("express");
var router = express.Router();
const errorController = require("../controllers/errorController");

/* GET home page. */
router.get("/error", errorController.error);

module.exports = router;
