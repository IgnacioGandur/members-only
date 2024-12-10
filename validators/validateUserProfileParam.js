const { param, validationResult } = require("express-validator");
const { checkIfUserExistsById, getAllUsers } = require("../db/queries");

const validateParams = [
    param("userId")
        .trim()
        .notEmpty()
        .withMessage("The param can't be empty.")
        .isInt()
        .withMessage("The param must be an integer.")
        .custom(async (userId) => {
            if (Number.isNaN(Number(userId))) {
                return;
            }

            const userExists = await checkIfUserExistsById(userId);

            if (!userExists) {
                throw new Error(
                    "The user profile you are looking for doesn't exist.",
                );
            }
        }),
];

const validateParamMiddleware = [
    validateParams,
    async (req, res, next) => {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            const users = await getAllUsers();

            return res.status(400).render("pages/users", {
                user: req.user,
                users: users,
                validationErrors: validationErrors.array(),
            });
        }

        next();
    },
];

module.exports = validateParamMiddleware;
