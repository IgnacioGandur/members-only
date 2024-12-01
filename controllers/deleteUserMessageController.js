const checkAuthentication = require("../middleware/checkAuthentication");
const validateUserMessageDeletion = require("../validators/validateUserMessageDeletion");
const { validationResult } = require("express-validator");
const dbInteractions = require("../db/queries");

const deleteUserMessageController = {
    deleteUserMessagePost: [
        checkAuthentication,
        validateUserMessageDeletion,
        async (req, res) => {
            const { id: userId } = req.user;
            const { messageId } = req.body;
            const validationErrors = validationResult(req);
            const profilePictures =
                await dbInteractions.getProfilePicturesPath();
            const userMessages = await dbInteractions.getUserMessages(userId);

            if (!validationErrors.isEmpty()) {
                return res.status(401).render("pages/dashboard", {
                    user: req.user,
                    profilePictures: profilePictures,
                    validationErrors: validationErrors.array(),
                    userMessages: userMessages,
                });
            }

            console.log(req.body);
            await dbInteractions.deleteUserMessage(userId, messageId);
            res.redirect("/dashboard");
        },
    ],
};

module.exports = deleteUserMessageController;
