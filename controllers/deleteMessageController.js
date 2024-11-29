const checkAuthentication = require("../middleware/checkAuthentication");
const { body, validationResult } = require("express-validator");
const dbInteractions = require("../db/queries");

const validateMessageDeletion = [
    body("messageId")
        .trim()
        .notEmpty()
        .withMessage("The message id field can't be empty.")
        .isInt()
        .withMessage("The message field must be an integer."),
];

const deleteMessageController = {
    deleteMessagePost: [
        validateMessageDeletion,
        checkAuthentication,
        async (req, res) => {
            if (!req.user.is_admin) {
                return res.redirect("/login");
            }
            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {
                const messages = await dbInteractions.getAllMessages();
                return res.status(401).render("pages/index", {
                    validationErrors: validationErrors.array(),
                    user: req.user,
                    messages: messages,
                });
            }

            const { messageId } = req.body;
            await dbInteractions.deleteMessage(messageId);

            return res.redirect("/messages");
        },
    ],
};

module.exports = deleteMessageController;
