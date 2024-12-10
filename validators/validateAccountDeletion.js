const { body, validationResult } = require("express-validator");
const { getUserPassword } = require("../db/queries");
const bcrypt = require("bcryptjs");

const validationChain = [
    body("deleteUserPass")
        .trim()
        .notEmpty()
        .withMessage("The password field can't be empty")
        .custom(async (deleteUserPass, { req }) => {
            const { id } = req.user;
            const userPassword = await getUserPassword(id);
            const passwordsMatch = await bcrypt.compare(
                deleteUserPass,
                userPassword,
            );

            if (!passwordsMatch) {
                throw new Error(
                    `The password: "${deleteUserPass}" is not correct. `,
                );
            }
        }),
];

const validateAccountDeletion = [
    validationChain,
    async (req, res, next) => {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            return res.status(401).render("pages/dashboard", {
                validationErrors: validationErrors.array(),
                dashboardSection: "delete-account",
                user: req.user,
            });
        }

        next();
    },
];

module.exports = validateAccountDeletion;
