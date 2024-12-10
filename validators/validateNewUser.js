const { body, validationResult } = require("express-validator");
const {
    getProfilePicturesPath,
    checkIfProfilePictureExists,
    usernameExists,
} = require("../db/queries");

const validationChain = [
    body("firstName")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("First name can't be empty.")
        .isAlpha()
        .withMessage("First name must contain only letters.")
        .isLength({ min: 3, max: 20 })
        .withMessage(
            "First name must be at least 3 characters long and 20 characters max.",
        )
        .toLowerCase(),
    body("lastName")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Last name can't be empty.")
        .isAlpha()
        .withMessage("Last name must contain only letters.")
        .isLength({ min: 3, max: 20 })
        .withMessage(
            "Last name must be at least 3 characters long and 20 characters max.",
        )
        .toLowerCase(),
    body("username")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("The username field can't be empty.")
        .isLength({ min: 3, max: 30 })
        .withMessage(
            "Username must be at least 3 characters long and 30 characters max.",
        )
        .custom(async (username) => {
            const usernameAlreadyExists = await usernameExists(username);

            if (usernameAlreadyExists) {
                throw new Error(
                    `The username: "${username}" is already registered. Please try another one. `,
                );
            }
        })
        .toLowerCase(),
    body("bio")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Your Bio can't be empty.")
        .isLength({ min: 5, max: 150 })
        .withMessage("Your bio must be between 5 and 150 characters long.")
        .toLowerCase(),
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
        .escape()
        .notEmpty()
        .withMessage("Select one gender.")
        .isIn(["male", "female"])
        .withMessage("Gender value must be either male of female.")
        .toLowerCase(),
    body("profilePicture")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("You must choose a profile picture.")
        .isInt()
        .withMessage("The profile picture value must be an integer.")
        .custom(async (id) => {
            const profilePictureExists = await checkIfProfilePictureExists(id);
            if (!profilePictureExists) {
                throw new Error(
                    "The provided profile picture id doesn't exist.",
                );
            }
        }),
];

const validateNewUser = [
    validationChain,
    async (req, res, next) => {
        const validationErrors = validationResult(req);
        const {
            firstName,
            lastName,
            username,
            bio,
            password,
            confirmPassword,
            gender,
            profilePicture,
        } = req.body;

        if (!validationErrors.isEmpty()) {
            const profilePictures = await getProfilePicturesPath();
            return res.render("pages/register", {
                validationErrors: validationErrors.array(),
                profilePictures: profilePictures,
                userInput: {
                    firstName,
                    lastName,
                    username,
                    bio,
                    password,
                    confirmPassword,
                    gender,
                    profilePicture,
                },
            });
        }

        next();
    },
];

module.exports = validateNewUser;
