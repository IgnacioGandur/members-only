const { body, validationResult } = require("express-validator");
const {
    getProfilePicturesPath,
    checkIfUpdatedUsernameIsValid,
} = require("../db/queries");

const validationChain = [
    body("firstName")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("The first name field can't be empty.")
        .isAlpha()
        .withMessage("The first name field must contain only letters.")
        .isLength({ min: 2, max: 20 })
        .withMessage("First name must be between 2 and 20 characters.")
        .toLowerCase(),
    body("lastName")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("The last name field can't be empty.")
        .isAlpha()
        .withMessage("The last name field must contain only letters.")
        .isLength({ min: 2, max: 20 })
        .withMessage("Last name must be between 2 and 20 characters.")
        .toLowerCase(),
    body("username")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("The username field can't be empty.")
        .not()
        .matches(/\s/, "gm")
        .withMessage("The username field can't contain white spaces.")
        .isLength({ min: 2, max: 30 })
        .withMessage("Username must be between 3 and 30 characters.")
        .custom(async (updatedUsername, { req }) => {
            const { id } = req.user;
            const usernameAlreadyExists = await checkIfUpdatedUsernameIsValid(
                id,
                updatedUsername,
            );

            if (usernameAlreadyExists === undefined) {
                return;
            }

            if (usernameAlreadyExists) {
                throw new Error(
                    "The username already exists, please try another one.",
                );
            }
        })
        .toLowerCase(),
    body("gender")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("The gender field can't be empty.")
        .isIn(["male", "female"])
        .withMessage("The gender must be either 'male' or 'female'.")
        .toLowerCase(),
    body("bio")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("The bio field can't be empty.")
        .isLength({ min: 5, max: 150 })
        .withMessage("The bio field must be between 5 and 150 characters long.")
        .toLowerCase(),
];

const validateUserUpdate = [
    validationChain,
    async (req, res, next) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            const profilePictures = await getProfilePicturesPath();
            return res.status(401).render("pages/dashboard", {
                user: req.user,
                dashboardSection: "profile-info",
                profilePictures: profilePictures,
                validationErrors: validationErrors.array(),
            });
        }

        next();
    },
];

module.exports = validateUserUpdate;
