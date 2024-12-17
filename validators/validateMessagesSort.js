const { query, validationResult } = require("express-validator");
const { getAllMessages } = require("../db/queries");

const validationChain = [
    query("sortBy")
        .trim()
        .notEmpty()
        .withMessage("The sort by query can't be empty.")
        .bail()
        .isIn(["ASC", "DESC"])
        .withMessage("The sort by query must be either 'DESC' or 'ASC'."),
];

const validateMessagesSort = [
    validationChain,
    async (req, res, next) => {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            const messages = await getAllMessages();
            return res.status(401).render("pages/index", {
                user: req.user,
                messages: messages,
            });
        }

        next();
    },
];

module.exports = validateMessagesSort;
