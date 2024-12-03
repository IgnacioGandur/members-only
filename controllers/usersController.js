const dbInteractions = require("../db/queries");
const validateParamMiddleware = require("../validators/validateUserProfileParam");

const usersController = {
    async usersGet(req, res) {
        const users = await dbInteractions.getAllUsers();

        res.render("pages/users", {
            users: users,
            user: req.user,
        });
    },

    userProfileGet: [
        validateParamMiddleware,
        async (req, res) => {
            const { userId } = req.params;
            const profileInfo = await dbInteractions.getUserProfile(userId);
            res.render("pages/userProfile", {
                profileInfo: profileInfo,
            });
        },
    ],
};

module.exports = usersController;
