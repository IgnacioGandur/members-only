const { body, validationResult } = require("express-validator");
const dbInteractions = require("../db/queries");
const bcrypt = require("bcryptjs");

const validateLogin = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("The username field can't be empty."),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("The password field can't be empty.")
        .custom(async (password, { req }) => {
            const { username } = req.body;
            const user = await dbInteractions.getUserByUsername(username);

            if (!user) {
                throw new Error(`The username: "${username}" doesn't exist.`);
            }

            const passwordsMatch = await bcrypt.compare(
                password,
                user.password,
            );

            if (!passwordsMatch) {
                throw new Error("The password is not correct.");
            }
        }),
];

const loginController = {
    loginGet(req, res) {
        res.render("pages/login");
    },
    loginPost: [
        validateLogin,
        (req, res, next) => {
            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {
                return res.status(401).render("pages/login", {
                    validationErrors: validationErrors.array(),
                });
            }

            next();
        },
    ],
};

module.exports = loginController;
