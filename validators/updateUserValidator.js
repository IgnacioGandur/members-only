const { body } = require("express-validator");
const dbInteractions = require("../db/queries");

const validateUserUpdate = [
    body("updatedProfilePicture")
        .trim()
        .notEmpty()
        .withMessage("The new profile picture field can't be empty.")
        .isInt()
        .withMessage("The new profile picture field must be an integer."),
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
        .not()
        .matches(/\s/, "gm")
        .withMessage("The username field can't contain white spaces.")
        .custom(async (updatedUsername, { req }) => {
            const usernameAlreadyExists =
                await dbInteractions.checkIfUpdatedUsernameIsValid(
                    req.user.id,
                    updatedUsername,
                );

            if (usernameAlreadyExists === undefined) {
                console.log("use didn't updated the username field");
                return;
            }

            if (usernameAlreadyExists) {
                throw new Error(
                    "The username already exists, please try another one.",
                );
            }
        }),
    body("gender")
        .trim()
        .notEmpty()
        .withMessage("The gender field can't be empty.")
        .isIn(["male", "female"])
        .withMessage("The gender must be either 'male' or 'female'."),
    body("bio").trim().notEmpty().withMessage("The bio field can't be empty."),
];

module.exports = validateUserUpdate;
