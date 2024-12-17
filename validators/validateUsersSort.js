const { query, validationResult } = require("express-validator");

const validationChain = [
    query("sortBy")
        .trim()
        .notEmpty()
        .withMessage("The sort by query can't be empty.")
        .bail()
        .escape()
        .isIn(["ASC", "DESC"])
        .withMessage('The sorting value must be either "ASC" or "DESC".')
        .bail(),
];

const validateUsersSort = [
    validationChain,
    async (req, res, next) => {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            return res.status(401).render("pages/users", {
                user: req.user,
                validationErrors: validationErrors.array(),
            });
        }

        next();
    },
];

module.exports = validateUsersSort;
