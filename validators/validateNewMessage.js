const { body, validationResult } = require("express-validator");

const validationChain = [
    body("title")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("The message title field can't be empty.")
        .isLength({ min: 3, max: 100 })
        .withMessage(
            "The message title should be between 3 and 100 characters.",
        ),
    body("content")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("The message content field can't be empty.")
        .isLength({ min: 5, max: 255 })
        .withMessage(
            "The message content should be between 5 and 255 characters.",
        ),
];

const validateNewMessage = [
    validationChain,
    async (req, res, next) => {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            return res.status(401).render("pages/new-message", {
                validationErrors: validationErrors.array(),
                user: req.user,
            });
        }

        next();
    },
];

module.exports = validateNewMessage;
