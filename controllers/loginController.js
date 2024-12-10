const checkIfLoggedIn = require("../middleware/checkIfLoggedIn");
const validateLogin = require("../validators/validateLogin");
const passport = require("passport");

const loginController = {
    loginGet: [
        checkIfLoggedIn,
        (req, res) => {
            const { error } = req.query;
            res.render("pages/login", {
                authError: error,
            });
        },
    ],
    loginPost: [
        checkIfLoggedIn,
        validateLogin,
        passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/login",
        }),
    ],
};

module.exports = loginController;
