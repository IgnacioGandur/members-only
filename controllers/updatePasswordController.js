const dbInteractions = require("../db/queries");
const validateUpdatedPassword = require("../validators/updatedPasswordValidator");
const setActiveLink = require("../middleware/activeLink");
const checkAuthentication = require("../middleware/checkAuthentication");
const { validationResult } = require("express-validator");

const updatePasswordController = {
    updatePasswordPost: [
        checkAuthentication,
        validateUpdatedPassword,
        setActiveLink,
        async (req, res) => {
            const profilePictures =
                await dbInteractions.getProfilePicturesPath();
            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {
                return res.status(401).render("pages/dashboard", {
                    user: req.user,
                    validationErrors: validationErrors.array(),
                    profilePictures: profilePictures,
                });
            }

            const { newPassword } = req.body;
            const { id: userId } = req.user;

            await dbInteractions.updateUserPassword(userId, newPassword);

            res.redirect("/dashboard");
        },
    ],
};

module.exports = updatePasswordController;
