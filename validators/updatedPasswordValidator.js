const { body } = require("express-validator");
const bcrypt = require("bcryptjs");
const dbInteractions = require("../db/queries");

const validateUpdatedPassword = [
    body("currentPassword")
        .trim()
        .notEmpty()
        .withMessage("The current password field can't be empty. ")
        .custom(async (currentPassword, { req }) => {
            const { id: userId } = req.user;
            const correctUserPassword =
                await dbInteractions.getUserPassword(userId);

            const passwordsMatch = await bcrypt.compare(
                currentPassword,
                correctUserPassword,
            );

            if (!passwordsMatch) {
                throw new Error("The current password is not correct.");
            }
        }),
    body("newPassword")
        .trim()
        .notEmpty()
        .withMessage("The new password field can't be empty."),
    body("confirmNewPassword")
        .trim()
        .notEmpty()
        .withMessage("The confirm new password field can't be empty.")
        .custom(async (confirmNewPassword, { req }) => {
            const { newPassword } = req.body;

            if (newPassword !== confirmNewPassword) {
                throw new Error(
                    "The 'new password' and the 'confirm new password' values don't match.",
                );
            }
        }),
];

module.exports = validateUpdatedPassword;
