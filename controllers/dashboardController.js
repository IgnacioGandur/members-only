const dbInteractions = require("../db/queries");
const checkAuthentication = require("../middleware/checkAuthentication");

const dashboardController = {
    activeSidebarLink: (req, res, next) => {
        const { originalUrl } = req;
        res.locals.activeSidebarLink = originalUrl;
        next();
    },

    dashboardGet: [
        checkAuthentication,
        async (req, res) => {
            res.redirect("/dashboard/profile-info");
        },
    ],

    profileInfoGet: [
        async (req, res) => {
            res.render("pages/dashboard", {
                dashboardSection: "profile-info",
                userMessages: [],
                user: req.user,
            });
        },
    ],

    profilePictureGet: [
        async (req, res) => {
            const profilePictures =
                await dbInteractions.getProfilePicturesPath();
            res.render("pages/dashboard.ejs", {
                dashboardSection: "profile-picture",
                user: req.user,
                userMessages: [],
                profilePictures: profilePictures,
            });
        },
    ],

    accountStatusGet: [
        async (req, res) => {
            res.render("pages/dashboard", {
                dashboardSection: "account-status",
                user: req.user,
                userMessages: [],
            });
        },
    ],

    updatePasswordGet: [
        async (req, res) => {
            res.render("pages/dashboard", {
                dashboardSection: "update-password",
                user: req.user,
                userMessages: [],
            });
        },
    ],

    deleteAccountGet: [
        async (req, res) => {
            res.render("pages/dashboard", {
                dashboardSection: "delete-account",
                user: req.user,
                userMessages: [],
            });
        },
    ],

    userMessagesGet: [
        async (req, res) => {
            res.render("pages/dashboard", {
                dashboardSection: "user-messages",
                user: req.user,
                userMessages: [],
            });
        },
    ],
};

module.exports = dashboardController;
