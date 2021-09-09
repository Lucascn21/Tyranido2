var express = require("express");
var router = express.Router();
const landingController = require("../controllers/landingController");
const { isNotAuth } = require("../middlewares/session");

/* GET home page. */
router.get("/", isNotAuth, landingController.index);

/* My landing is also my register route */
router.get("/register", isNotAuth, landingController.index);

module.exports = router;
