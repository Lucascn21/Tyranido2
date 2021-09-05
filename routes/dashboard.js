var express = require('express');
var router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const{isAuth}=require("../helpers/session")
/* GET dashboard */
router.get('/', isAuth,dashboardController.index);

module.exports = router;
