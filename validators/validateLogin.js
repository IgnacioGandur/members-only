const { body, validationResult } = require("express-validator");
const {
    getUserByUsername,
    checkIfUserExistsByUsername,
} = require("../db/queries");
const bcrypt = require("bcryptjs");

const validationChain = [
    body("username")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("The username field can't be empty.")
        .toLowerCase()
        .custom(async (username) => {
            const userExists = await checkIfUserExistsByUsername(username);

            if (!userExists) {
                throw new Error(`The username: "${username}" doesn't exist.`);
            }
        })
        .bail({ level: "request" }),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("The password field can't be empty.")
        .custom(async (password, { req }) => {
            const { username } = req.body;
            const user = await getUserByUsername(username);
            const passwordsMatch = await bcrypt.compare(
                password,
                user.password,
            );

            if (!passwordsMatch) {
                throw new Error("The password is not correct.");
            }
        }),
];

const validateLogin = [
    validationChain,
    (req, res, next) => {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            const { username, password } = req.body;
            return res.status(401).render("pages/login", {
                validationErrors: validationErrors.array(),
                userInput: {
                    username,
                    password,
                },
            });
        }

        next();
    },
];

module.exports = validateLogin;
