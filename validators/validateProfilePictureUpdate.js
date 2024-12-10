const { body, validationResult } = require("express-validator");
const {
    checkIfProfilePictureExists,
    getProfilePicturesPath,
} = require("../db/queries");

const validationChain = [
    body("updatedProfilePicture")
        .trim()
        .notEmpty()
        .withMessage("The updated profile picture id field can't be empty.")
        .isInt()
        .withMessage("The updated profile picture id field must be an integer.")
        .custom(async (updatedProfilePicture) => {
            const profilePictureExists = await checkIfProfilePictureExists(
                updatedProfilePicture,
            );

            if (!profilePictureExists) {
                throw new Error(
                    "The profile picture you are tyring to update to doesn't exist.",
                );
            }
        }),
];

const validateProfilePictureUpdate = [
    validationChain,
    async (req, res, next) => {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            const profilePictures = await getProfilePicturesPath();

            return res.status(401).render("pages/dashboard", {
                validationErrors: validationErrors.array(),
                dashboardSection: "profile-info",
                user: req.user,
                profilePictures: profilePictures,
            });
        }

        next();
    },
];

module.exports = validateProfilePictureUpdate;
