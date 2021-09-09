var express = require("express");
var router = express.Router();
const loginController = require("../controllers/loginController");
const { isNotAuth } = require("../middlewares/session");

/* GET login page. */
router.get("/", isNotAuth, loginController.index);

module.exports = router;
