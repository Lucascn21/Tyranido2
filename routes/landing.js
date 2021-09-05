var express = require("express");
var router = express.Router();
const landingController = require("../controllers/landingController");
/* GET home page. */
router.get("/", landingController.index);

module.exports = router;
