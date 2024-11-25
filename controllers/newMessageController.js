const { body, validationResult } = require("express-validator");
const dbInteractions = require("../db/queries");

const validateNewMessage = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("The message title field can't be empty."),
    body("content")
        .trim()
        .notEmpty()
        .withMessage("The message content field can't be empty."),
];

const newMessageController = {
    async newMessageGet(req, res) {
        res.render("pages/new-message", {
            user: req.user,
        });
    },

    newMessagePost: [
        validateNewMessage,
        async (req, res) => {
            const { title, content } = req.body;
            const { id } = req.user;

            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {
                return res.status(401).render("pages/new-message", {
                    validationErrors: validationErrors.array(),
                });
            }

            await dbInteractions.insertNewMessage(id, title, content);
            return res.redirect("/");
        },
    ],
};

module.exports = newMessageController;
