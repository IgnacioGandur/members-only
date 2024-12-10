const { body, validationResult } = require("express-validator");
const {
    checkIfMessageExists,
    checkIfUserIsMessageAuthor,
    getUserMessages,
} = require("../db/queries");

const validationChain = [
    body("messageId")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("The message id field can't be empty.")
        .isInt()
        .withMessage("The message id must be an integer.")
        .custom(async (messageId) => {
            if (Number.isNaN(Number(messageId))) {
                return;
            }

            const messageExists = await checkIfMessageExists(messageId);
            if (!messageExists) {
                throw new Error(
                    "The message you are trying to delete doesn't exist.",
                );
            }
        })
        .custom(async (messageId, { req }) => {
            if (Number.isNaN(Number(messageId))) {
                return;
            }
            const { id } = req.user;
            const userIsMessageAuthor = await checkIfUserIsMessageAuthor(
                messageId,
                id,
            );

            if (!userIsMessageAuthor) {
                throw new Error(
                    "You are not the author of the message you are trying to delete.",
                );
            }
        }),
];

const validateOwnMessageDeletion = [
    validationChain,
    async (req, res, next) => {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            const { id } = req.user;
            const userMessages = await getUserMessages(id);

            return res.status(401).render("pages/dashboard", {
                dashboardSection: "user-messages",
                user: req.user,
                validationErrors: validationErrors.array(),
                userMessages: userMessages,
            });
        }

        next();
    },
];

module.exports = validateOwnMessageDeletion;
