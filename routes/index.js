var express = require("express");
var router = express.Router();

const dashboardController = require("../controllers/dashboardController");
const authController = require("../controllers/authController");
const landingController = require("../controllers/landingController");
const loginController = require("../controllers/loginController");

const { isNotAuth, isAuth } = require("../middlewares/session");


//-----------------------------------------------------------

// Routes for the resource /login

// autologout
//router.all('*',sessionController.checkLoginExpires);

/* GET home page. */
router.get("/", isNotAuth, landingController.index);

/* GET dashboard */
router.get("/dashboard", isAuth, dashboardController.index);

// Post Auth/register || login
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/logout", authController.logout);

/* GET register route */
router.get("/register", isNotAuth, landingController.index);

/* GET login page. */
router.get("/login", isNotAuth, loginController.index);

// logout - close login session

module.exports = router;
