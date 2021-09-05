var express = require('express');
var router = express.Router();
const dashboardController = require("../controllers/dashboardController");
/* GET dashboard */
router.get('/', dashboardController.index);

module.exports = router;
