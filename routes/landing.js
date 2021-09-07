var express = require("express");
var router = express.Router();
const landingController = require("../controllers/landingController");
const{isNotAuth}=require("../helpers/session")

/* GET home page. */
router.get("/", isNotAuth,landingController.index);

module.exports = router;
