const dbInteractions = require("../db/queries");
const { body, validationResult } = require("express-validator");

const validateAdminPass = [
    body("adminPass")
        .trim()
        .notEmpty()
        .withMessage("The admin pass field can't be empty.")
        .custom(async (adminPass) => {
            if (adminPass !== process.env.ADMIN_PASS) {
                throw new Error(
                    `The password: "${adminPass}" is not correct. You were not granted admin privileges.`,
                );
            }
        }),
];

const adminController = {
    adminPost: [
        validateAdminPass,
        async (req, res) => {
            const validationErrors = validationResult(req);
            const { id } = req.user;

            if (!validationErrors.isEmpty()) {
                return res.status(401).render("pages/dashboard", {
                    validationErrors: validationErrors.array(),
                    user: req.user,
                });
            }

            await dbInteractions.grantAdminPrivileges(id);

            res.redirect("/dashboard");
        },
    ],
};

module.exports = adminController;
