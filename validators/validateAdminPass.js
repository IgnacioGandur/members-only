const { body, validationResult } = require("express-validator");

const validationChain = [
    body("adminPass")
        .trim()
        .escape()
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

const validateAdminPass = [
    validationChain,
    async (req, res, next) => {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            return res.status(401).render("pages/dashboard", {
                dashboardSection: "account-status",
                user: req.user,
                validationErrors: validationErrors.array(),
            });
        }

        next();
    },
];

module.exports = validateAdminPass;
