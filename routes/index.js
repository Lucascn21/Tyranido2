var express = require("express");
var router = express.Router();

const lookupController = require("../controllers/lookupController");
const authController = require("../controllers/authController");
const landingController = require("../controllers/landingController");
const loginController = require("../controllers/loginController");
const searchController= require('../controllers/searchController')
const userController= require('../controllers/userController')
const { isNotAuth, isAuth } = require("../middlewares/session");

router.get("/", isNotAuth, landingController.index);

router.get("/register", isNotAuth, landingController.index);
router.get("/login", isNotAuth, loginController.index);

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/changepw", authController.changepw);
router.get("/auth/logout", authController.logout);

router.get("/lookup", isAuth, lookupController.index);

router.post("/search",  isAuth, searchController.search);


router.get("/lookup/movie/:imdbID", isAuth, lookupController.movie);
router.get("/lookup/game/:imdbID", isAuth, lookupController.game);
router.get("/lookup/series/:imdbID", isAuth, lookupController.series);

router.get("/user", isAuth, userController.index);
router.post("/user/like", isAuth, userController.like);





module.exports = router;
