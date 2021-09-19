var express = require("express");
var router = express.Router();

const lookupController = require("../controllers/lookupController");
const authController = require("../controllers/authController");
const landingController = require("../controllers/landingController");
const loginController = require("../controllers/loginController");
const searchController= require('../controllers/searchController')
const { isNotAuth, isAuth } = require("../middlewares/session");


//-----------------------------------------------------------

// Routes for the resource /login

// autologout
//router.all('*',sessionController.checkLoginExpires);


router.get("/", isNotAuth, landingController.index);

router.get("/register", isNotAuth, landingController.index);
router.get("/login", isNotAuth, loginController.index);

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/logout", authController.logout);

router.get("/lookup", isAuth, lookupController.index);

router.post("/search",  isAuth, searchController.search);






module.exports = router;
