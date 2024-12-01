const { body } = require("express-validator");
const dbInteractions = require("../db/queries");

const validateUserMessageDeletion = [
    body("messageId")
        .trim()
        .notEmpty()
        .withMessage("The message id field can't be empty.")
        .isInt()
        .withMessage("The message id field must be an integer")
        .custom(async (messageId, { req }) => {
            const { id: userId } = req.user;
            const messageExists = await dbInteractions.checkIfMessageExists(
                userId,
                messageId,
            );

            if (!messageExists) {
                throw new Error(
                    "The message you are trying to delete doesn't exists.",
                );
            }
        }),
];

module.exports = validateUserMessageDeletion;
