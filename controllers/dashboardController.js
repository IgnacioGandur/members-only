const bcrypt = require("bcryptjs");
const dbInteractions = require("../db/queries");
const checkAuthentication = require("../middleware/checkAuthentication");
const { body, validationResult } = require("express-validator");
const updatedPasswordValidator = require("../validators/updatedPasswordValidator");
const validateProfilePictureUpdate = require("../validators/validateProfilePictureUpdate");
const validateUserUpdate = require("../validators/updateUserValidator");

const validateMemberPass = [
    body("memberPass")
        .trim()
        .notEmpty()
        .withMessage("The member code field can't be empty.")
        .custom(async (memberPass) => {
            if (memberPass !== process.env.MEMBER_PASS) {
                throw new Error(
                    `The member code: "${memberPass}" is not correct. You were not granted member privileges.`,
                );
            }
        }),
];

const validateAdminPass = [
    body("adminPass")
        .trim()
        .notEmpty()
        .withMessage("The admin pass field can't be empty.")
        .custom(async (adminPass) => {
            if (adminPass !== process.env.ADMIN_PASS) {
                throw new Error(
                    `The password: "${adminPass}" is not correct. You were not granted admin privileges.`,
                );
            }
        }),
];

const validateUserPass = [
    body("deleteUserPass")
        .trim()
        .notEmpty()
        .withMessage("The password field can't be empty")
        .custom(async (deleteUserPass, { req }) => {
            const { id } = req.user;
            const userPassword = await dbInteractions.getUserPassword(id);
            const passwordsMatch = await bcrypt.compare(
                deleteUserPass,
                userPassword,
            );

            if (!passwordsMatch) {
                throw new Error(
                    `The password: "${deleteUserPass}" is not correct. `,
                );
            }
        }),
];

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
            const profilePictures =
                await dbInteractions.getProfilePicturesPath();
            res.render("pages/dashboard", {
                dashboardSection: "profile-info",
                profilePictures: profilePictures,
                userMessages: [],
                user: req.user,
            });
        },
    ],

    updateProfilePicturePost: [
        validateProfilePictureUpdate,
        async (req, res) => {
            const profilePictures =
                await dbInteractions.getProfilePicturesPath();
            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {
                return res.status(401).render("pages/dashboard", {
                    user: req.user,
                    profilePictures: profilePictures,
                    validationErrors: validationErrors.array(),
                    dashboardSection: "profile-info",
                });
            }

            const { id: userId } = req.user;
            const { updatedProfilePicture } = req.body;

            await dbInteractions.updateProfilePicture(
                userId,
                updatedProfilePicture,
            );
            res.redirect("/dashboard");
        },
    ],

    updateuserProfilePost: [
        validateUserUpdate,
        checkAuthentication,
        async (req, res) => {
            const validationErrors = validationResult(req);
            const profilePictures =
                await dbInteractions.getProfilePicturesPath();

            if (!validationErrors.isEmpty()) {
                return res.status(401).render("pages/dashboard", {
                    user: req.user,
                    profilePictures: profilePictures,
                    validationErrors: validationErrors.array(),
                    dashboardSection: "profile-info",
                });
            }

            const { firstName, lastName, username, gender, bio } = req.body;

            const { id: userId } = req.user;

            await dbInteractions.updateUserProfile(
                userId,
                firstName,
                lastName,
                username,
                gender,
                bio,
            );

            res.redirect("/dashboard");
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

    updatePasswordPost: [
        updatedPasswordValidator,
        async (req, res) => {
            const profilePictures =
                await dbInteractions.getProfilePicturesPath();
            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {
                return res.status(401).render("pages/dashboard", {
                    user: req.user,
                    validationErrors: validationErrors.array(),
                    profilePictures: profilePictures,
                    dashboardSection: "update-password",
                });
            }

            const { newPassword } = req.body;
            const { id: userId } = req.user;

            await dbInteractions.updateUserPassword(userId, newPassword);

            res.redirect("/dashboard");
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

    deleteAccountPost: [
        validateUserPass,
        async (req, res, next) => {
            const { id } = req.user;
            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {
                return res.status(401).render("pages/dashboard", {
                    validationErrors: validationErrors.array(),
                    dashboardSection: "delete-account",
                    user: req.user,
                });
            }

            req.logout((error) => {
                if (error) {
                    next(error);
                }

                res.redirect("/");
            });
            await dbInteractions.deleteUser(id);
        },
    ],

    userMessagesGet: [
        async (req, res) => {
            const { id } = req.user;
            const userMessages = await dbInteractions.getUserMessages(id);

            res.render("pages/dashboard", {
                dashboardSection: "user-messages",
                user: req.user,
                userMessages: userMessages,
            });
        },
    ],

    enableMemberStatus: [
        validateMemberPass,
        async (req, res) => {
            const { id } = req.user;
            const validationErrors = validationResult(req);
            const userMessages = await dbInteractions.getUserMessages(id);
            const profilePictures =
                await dbInteractions.getProfilePicturesPath();

            if (!validationErrors.isEmpty()) {
                return res.status(401).render("pages/dashboard", {
                    validationErrors: validationErrors.array(),
                    user: req.user,
                    userMessages: [],
                    profilePictures: profilePictures,
                    dashboardSection: "account-status",
                });
            }

            console.log("blablabla");
            await dbInteractions.grantMemberPrivileges(id);
            res.redirect("/dashboard/acount-status");
        },
    ],

    enableAdminStatus: [
        validateAdminPass,
        async (req, res) => {
            const { id } = req.user;
            const validationErrors = validationResult(req);
            const userMessages = await dbInteractions.getUserMessages(id);
            const profilePictures =
                await dbInteractions.getProfilePicturesPath();

            if (!validationErrors.isEmpty()) {
                return res.status(401).render("pages/dashboard", {
                    user: req.user,
                    dashboardSection: "account-status",
                    validationErrors: validationErrors.array(),
                    profilePictures: profilePictures,
                    userMessages: userMessages,
                });
            }

            await dbInteractions.grantAdminPrivileges(id);

            res.redirect("/dashboard/account-status");
        },
    ],
};

module.exports = dashboardController;
