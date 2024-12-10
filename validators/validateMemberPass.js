const { body, validationResult } = require("express-validator");

const validationChain = [
    body("memberPass")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("The member code field can't be empty.")
        .custom(async (memberPass) => {
            if (memberPass !== process.env.MEMBER_PASS) {
                throw new Error(
                    `The member code: "${memberPass}" is not correct. You were not granted member privileges.`,
                );
            }
        }),
];

const validateMemberPass = [
    validationChain,
    async (req, res, next) => {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            return res.status(401).render("pages/dashboard", {
                validationErrors: validationErrors.array(),
                user: req.user,
                dashboardSection: "account-status",
            });
        }

        next();
    },
];

module.exports = validateMemberPass;
