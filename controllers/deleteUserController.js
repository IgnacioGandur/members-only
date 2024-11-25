const { body, validationResult } = require("express-validator");
const dbInteractions = require("../db/queries");
const bcrypt = require("bcryptjs");

const validateUserPass = [
    body("deleteUserPass")
        .trim()
        .notEmpty()
        .withMessage("The password field can't be empty")
        .custom(async (deleteUserPass, { req }) => {
            const { id } = req.user;
            const userPassword = await dbInteractions.getUserPassword(id);
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

const deleteUserController = {
    deleteUserPost: [
        validateUserPass,
        async (req, res, next) => {
            const { id } = req.user;
            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {
                return res.status(401).render("pages/dashboard", {
                    validationErrors: validationErrors.array(),
                    user: req.user,
                });
            }

            req.logout((error) => {
                if (error) {
                    next(error);
                }

                res.redirect("/");
            });
            await dbInteractions.deleteUser(id);
        },
    ],
};

module.exports = deleteUserController;
