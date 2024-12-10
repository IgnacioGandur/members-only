const validatePasswordUpdate = require("../validators/validatePasswordUpdate");
const validateProfilePictureUpdate = require("../validators/validateProfilePictureUpdate");
const validateUserUpdate = require("../validators/validateUserUpdate");
const validateAdminPass = require("../validators/validateAdminPass");
const validateMemberPass = require("../validators/validateMemberPass");
const validateAccountDeletion = require("../validators/validateAccountDeletion");
const validateOwnMessageDeletion = require("../validators/validateOwnMessageDeletion");
const {
    getProfilePicturesPath,
    getUserMessages,
    grantMemberPrivileges,
    updateUserPassword,
    updateProfilePicture,
    updateUserProfile,
    deleteUser,
    grantAdminPrivileges,
    deleteMessage,
} = require("../db/queries");

const dashboardController = {
    activeSidebarLink: (req, res, next) => {
        const { originalUrl } = req;
        res.locals.activeSidebarLink = originalUrl;
        next();
    },

    // Get controllers

    dashboardGet: [
        async (req, res) => {
            res.redirect("/dashboard/profile-info");
        },
    ],

    profileInfoGet: [
        async (req, res) => {
            const profilePictures = await getProfilePicturesPath();
            res.render("pages/dashboard", {
                dashboardSection: "profile-info",
                profilePictures: profilePictures,
                user: req.user,
            });
        },
    ],

    accountStatusGet: [
        async (req, res) => {
            res.render("pages/dashboard", {
                dashboardSection: "account-status",
                user: req.user,
                errorMessage: req.query.errorMessage,
            });
        },
    ],

    updatePasswordGet: [
        async (req, res) => {
            const { passMessage } = req.query;
            res.render("pages/dashboard", {
                dashboardSection: "update-password",
                user: req.user,
                passMessage: passMessage,
            });
        },
    ],

    deleteAccountGet: [
        async (req, res) => {
            res.render("pages/dashboard", {
                dashboardSection: "delete-account",
                user: req.user,
            });
        },
    ],

    userMessagesGet: [
        async (req, res) => {
            const { id } = req.user;
            const userMessages = await getUserMessages(id);

            res.render("pages/dashboard", {
                dashboardSection: "user-messages",
                user: req.user,
                userMessages: userMessages,
            });
        },
    ],

    // Post controllers

    updateProfilePicturePost: [
        validateProfilePictureUpdate,
        async (req, res) => {
            const { id: userId } = req.user;
            const { updatedProfilePicture } = req.body;

            await updateProfilePicture(userId, updatedProfilePicture);

            res.redirect("/dashboard/profile-info");
        },
    ],

    updateuserProfilePost: [
        validateUserUpdate,
        async (req, res) => {
            const { firstName, lastName, username, gender, bio } = req.body;
            const { id: userId } = req.user;
            await updateUserProfile(
                userId,
                firstName,
                lastName,
                username,
                gender,
                bio,
            );

            res.redirect("/dashboard/profile-info");
        },
    ],

    updatePasswordPost: [
        validatePasswordUpdate,
        async (req, res) => {
            const { newPassword } = req.body;
            const { id: userId } = req.user;

            await updateUserPassword(userId, newPassword);

            res.redirect(
                "/dashboard/update-password?passMessage=" +
                    encodeURIComponent("Password updated correctly!"),
            );
        },
    ],

    deleteAccountPost: [
        validateAccountDeletion,
        async (req, res, next) => {
            const { id } = req.user;
            req.logout((error) => {
                if (error) {
                    next(error);
                }

                res.redirect("/");
            });
            await deleteUser(id);
        },
    ],

    enableMemberStatusPost: [
        validateMemberPass,
        async (req, res) => {
            const { id } = req.user;
            await grantMemberPrivileges(id);

            res.redirect("/dashboard/account-status");
        },
    ],

    enableAdminStatusPost: [
        validateAdminPass,
        async (req, res) => {
            const { id } = req.user;
            await grantAdminPrivileges(id);

            res.redirect("/dashboard/account-status");
        },
    ],

    deleteOwnMessagePost: [
        validateOwnMessageDeletion,
        async (req, res) => {
            const { messageId } = req.body;
            await deleteMessage(messageId);

            res.redirect("/dashboard/user-messages");
        },
    ],
};

module.exports = dashboardController;
