const dbInteractions = require("../db/queries");
const validateProfilePictureUpdate = require("../validators/validateProfilePictureUpdate");
const checkAuthentication = require("../middleware/checkAuthentication");
const { validationResult } = require("express-validator");

const updateProfilePictureController = {
    updateProfilePicturePost: [
        checkAuthentication,
        validateProfilePictureUpdate,
        async (req, res) => {
            const profilePictures =
                await dbInteractions.getProfilePicturesPath();
            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {
                return res.status(401).render("pages/dashboard", {
                    user: req.user,
                    profilePictures: profilePictures,
                    validationErrors: validationErrors.array(),
                });
            }

            const { id: userId } = req.user;
            const { updatedProfilePicture } = req.body;

            await dbInteractions.updateProfilePicture(
                userId,
                updatedProfilePicture,
            );
            res.redirect("/dashboard");
        },
    ],
};

module.exports = updateProfilePictureController;
