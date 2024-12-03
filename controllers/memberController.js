const { body, validationResult } = require("express-validator");
const dbInteractions = require("../db/queries");

const validateMemberPass = [
    body("memberPass")
        .trim()
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

const memberController = {
    memberPost: [
        validateMemberPass,
        async (req, res) => {
            const { id } = req.user;
            const validationErrors = validationResult(req);
            const userMessages = await dbInteractions.getUserMessages(id);
            const profilePictures =
                await dbInteractions.getProfilePicturesPath();

            if (!validationErrors.isEmpty()) {
                return res.status(401).render("pages/dashboard", {
                    validationErrors: validationErrors.array(),
                    user: req.user,
                    userMessages: userMessages,
                    profilePictures: profilePictures,
                });
            }

            await dbInteractions.grantMemberPrivileges(id);
            res.redirect("/dashboard");
        },
    ],
};

module.exports = memberController;
