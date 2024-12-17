const { query, validationResult } = require("express-validator");
const { getAllUsers } = require("../db/queries");

const validationChain = [
    query("username")
        .trim()
        .notEmpty()
        .withMessage("The search term field can't be empty.")
        .escape(),
];

const validateUserSearch = [
    validationChain,
    async (req, res, next) => {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            const { users } = await getAllUsers();
            return res.status(401).render("pages/users", {
                validationErrors: validationErrors.array(),
                user: req.user,
                users: users,
            });
        }

        next();
    },
];

module.exports = validateUserSearch;
