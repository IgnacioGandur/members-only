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
            const { id } = req.user;
            const validationErrors = validationResult(req);
            const userMessages = await dbInteractions.getUserMessages(id);
            const profilePictures =
                await dbInteractions.getProfilePicturesPath();

            if (!validationErrors.isEmpty()) {
                return res.status(401).render("pages/dashboard", {
                    user: req.user,
                    validationErrors: validationErrors.array(),
                    profilePictures: profilePictures,
                    userMessages: userMessages,
                });
            }

            await dbInteractions.grantAdminPrivileges(id);

            res.redirect("/dashboard");
        },
    ],
};

module.exports = adminController;
