const { Router } = require("express");
const loginRouter = Router();
const loginController = require("../controllers/loginController");
const passport = require("passport");
const checkIfLoggedIn = require("../middleware/checkIfLoggedIn");

loginRouter.get("/", checkIfLoggedIn, loginController.loginGet);
loginRouter.post(
    "/",
    loginController.loginPost,
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
    }),
);

module.exports = loginRouter;
