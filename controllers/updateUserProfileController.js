const dbInteractions = require("../db/queries");
const { validationResult } = require("express-validator");
const validateUserUpdate = require("../validators/updateUserValidator");
const setActiveLink = require("../middleware/activeLink");
const checkAuthentication = require("../middleware/checkAuthentication");

const updateUserProfileController = {
    updateUserProfilePost: [
        checkAuthentication,
        setActiveLink,
        validateUserUpdate,
        async (req, res) => {
            const validationErrors = validationResult(req);
            const profilePictures =
                await dbInteractions.getProfilePicturesPath();

            if (!validationErrors.isEmpty()) {
                return res.status(401).render("pages/dashboard", {
                    user: req.user,
                    profilePictures: profilePictures,
                    validationErrors: validationErrors.array(),
                });
            }

            const {
                updatedProfilePicture,
                firstName,
                lastName,
                username,
                gender,
                bio,
            } = req.body;

            const { id: userId } = req.user;

            await dbInteractions.updateUserProfile(
                userId,
                updatedProfilePicture,
                firstName,
                lastName,
                username,
                gender,
                bio,
            );

            res.redirect("/dashboard");
        },
    ],
};

module.exports = updateUserProfileController;
