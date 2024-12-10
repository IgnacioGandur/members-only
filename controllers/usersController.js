const { getAllUsers, getUserProfile } = require("../db/queries.js");
const validateParamMiddleware = require("../validators/validateUserProfileParam");
const checkAuthentication = require("../middleware/checkAuthentication");
const checkIfIsMember = require("../middleware/checkIfIsMember");

const usersController = {
    usersGet: [
        checkIfIsMember,
        checkAuthentication,
        async (req, res) => {
            const users = await getAllUsers();

            res.render("pages/users", {
                users: users,
                user: req.user,
            });
        },
    ],

    userProfileGet: [
        checkIfIsMember,
        checkAuthentication,
        validateParamMiddleware,
        async (req, res) => {
            const { userId } = req.params;
            const profileInfo = await getUserProfile(userId);
            res.render("pages/userProfile", {
                profileInfo: profileInfo,
                user: req.user,
            });
        },
    ],
};

module.exports = usersController;
