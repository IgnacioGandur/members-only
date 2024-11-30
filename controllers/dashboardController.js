const dbInteractions = require("../db/queries");

const dashboardController = {
    dashboardGet: async (req, res) => {
        const profilePictures = await dbInteractions.getProfilePicturesPath();

        res.render("pages/dashboard", {
            user: req.user,
            profilePictures: profilePictures,
        });
    },
};

module.exports = dashboardController;
