const { body, validationResult } = require("express-validator");
const { checkIfMessageExists, getAllMessages } = require("../db/queries");

const validationChain = [
    body("messageId")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("The message id can't be empty.")
        .isInt()
        .withMessage("The message id must be an integer.")
        .custom(async (messageId) => {
            if (Number.isNaN(Number(messageId))) {
                return;
            }

            const messageExists = await checkIfMessageExists(messageId);
            if (!messageExists) {
                throw new Error(
                    "The message you are trying to delete doesn't exists.",
                );
            }
        })
        .custom(async (messageId, { req }) => {
            if (!req.user.is_admin) {
                throw new Error("You must be an admin to delete messages.");
            }
        }),
];

const validateMessageDeletion = [
    validationChain,
    async (req, res, next) => {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            const messages = await getAllMessages();
            return res.status(401).render("pages/index", {
                user: req.user,
                messages: messages,
                validationErrors: validationErrors.array(),
            });
        }

        next();
    },
];

module.exports = validateMessageDeletion;
