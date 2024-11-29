const { Router } = require("express");
const loginRouter = Router();
const loginController = require("../controllers/loginController");
const passport = require("passport");
const checkIfLoggedIn = require("../middleware/checkIfLoggedIn");
const setActiveLink = require("../middleware/activeLink");

loginRouter.get("/", checkIfLoggedIn, setActiveLink, loginController.loginGet);
loginRouter.post(
    "/",
    loginController.loginPost,
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
    }),
);

module.exports = loginRouter;
