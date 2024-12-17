const {
    getAllUsers,
    getUserProfile,
    searchUserByUsername,
    getAllUsersSortedBy,
} = require("../db/queries.js");
const checkAuthentication = require("../middleware/checkAuthentication");
const checkIfIsMember = require("../middleware/checkIfIsMember");
const validateParamMiddleware = require("../validators/validateUserProfileParam");
const validateUserSearch = require("../validators/validateUserSearch");
const validateUsersSort = require("../validators/validateUsersSort");

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

    searchUserGet: [
        checkIfIsMember,
        checkAuthentication,
        validateUserSearch,
        async (req, res) => {
            const { username } = req.query;
            const searchResults = await searchUserByUsername(username);
            res.render("pages/users", {
                users: searchResults,
                user: req.user,
                searchResultsMessage:
                    searchResults.length === 0
                        ? `No matches found for: "${username}"`
                        : `Showing search results for usernames that contain the term: "${username}".`,
            });
        },
    ],

    sortUsersGet: [
        checkIfIsMember,
        checkAuthentication,
        validateUsersSort,
        async (req, res) => {
            const { sortBy } = req.query;
            const sortedUsers = await getAllUsersSortedBy(sortBy);
            res.render("pages/users", {
                users: sortedUsers,
                user: req.user,
                sortedUsersMessage: `Sorting users by ${sortBy === "DESC" ? "newest" : "oldest"} first.`,
            });
        },
    ],
};

module.exports = usersController;
