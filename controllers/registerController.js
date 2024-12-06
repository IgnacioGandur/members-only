const { body, validationResult } = require("express-validator");
const dbInteractions = require("../db/queries");

const validateNewUser = [
    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("The first name field can't be empty.")
        .isAlpha()
        .withMessage("The first name field must contain only letters."),
    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("The last name field can't be empty.")
        .isAlpha()
        .withMessage("The last name field must contain only letters."),
    body("username")
        .trim()
        .notEmpty()
        .withMessage("The username field can't be empty.")
        .custom(async (username) => {
            const usernameAlreadyExists =
                await dbInteractions.usernameExists(username);

            if (usernameAlreadyExists) {
                throw new Error(
                    `The username: "${username}" is already registered. Please try another one. `,
                );
            }
        }),
    body("bio").optional(),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("The password field can't be empty."),
    body("confirmPassword")
        .trim()
        .notEmpty()
        .withMessage("The repeat password field can't be empty.")
        .custom(async (confirmPassword, { req }) => {
            const { password } = req.body;

            if (password !== confirmPassword) {
                throw new Error(
                    "The password and the confirmation password don't match.",
                );
            }
        }),
    body("gender")
        .trim()
        .notEmpty()
        .withMessage("Select one gender.")
        .isIn(["male", "female"])
        .withMessage("Gender value must be either male of female."),
    body("profilePicture")
        .trim()
        .notEmpty()
        .withMessage("You must choose a profile picture.")
        .isInt()
        .withMessage("The profile picture value must be an integer."),
];

const registerController = {
    async registerGet(req, res) {
        const profilePictures = await dbInteractions.getProfilePicturesPath();

        res.render("pages/register", {
            profilePictures: profilePictures,
        });
    },

    registerPost: [
        validateNewUser,
        async (req, res) => {
            const validationErrors = validationResult(req);
            const profilePictures =
                await dbInteractions.getProfilePicturesPath();
            const {
                firstName,
                lastName,
                username,
                bio,
                password,
                gender,
                profilePicture,
            } = req.body;

            if (!validationErrors.isEmpty()) {
                return res.status(401).render("pages/register", {
                    validationErrors: validationErrors.array(),
                    profilePictures: profilePictures,
                });
            }

            await dbInteractions.insertUser(
                firstName,
                lastName,
                username,
                bio,
                password,
                gender,
                profilePicture,
            );

            res.redirect("/login");
        },
    ],
};

module.exports = registerController;
