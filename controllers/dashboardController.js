const dbInteractions = require("../db/queries");
const checkAuthentication = require("../middleware/checkAuthentication");

const dashboardController = {
    dashboardGet: [
        checkAuthentication,
        async (req, res) => {
            const { id: userId } = req.user;
            const profilePictures =
                await dbInteractions.getProfilePicturesPath();
            const userMessages = await dbInteractions.getUserMessages(userId);

            res.render("pages/dashboard", {
                user: req.user,
                profilePictures: profilePictures,
                userMessages: userMessages,
            });
        },
    ],
};

module.exports = dashboardController;
