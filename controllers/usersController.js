const dbInteractions = require("../db/queries");
const validateParamMiddleware = require("../validators/validateUserProfileParam");
const checkAuthentication = require("../middleware/checkAuthentication");

const usersController = {
    usersGet: [
        checkAuthentication,
        async (req, res) => {
            const users = await dbInteractions.getAllUsers();

            res.render("pages/users", {
                users: users,
                user: req.user,
            });
        },
    ],

    userProfileGet: [
        checkAuthentication,
        validateParamMiddleware,
        async (req, res) => {
            const { userId } = req.params;
            const profileInfo = await dbInteractions.getUserProfile(userId);
            res.render("pages/userProfile", {
                profileInfo: profileInfo,
                user: req.user,
            });
        },
    ],
};

module.exports = usersController;
