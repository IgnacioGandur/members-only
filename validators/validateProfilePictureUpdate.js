const { body } = require("express-validator");

const validateProfilePictureUpdate = [
    body("updatedProfilePicture")
        .trim()
        .notEmpty()
        .withMessage("The updated profile picture id field can't be empty.")
        .isInt()
        .withMessage(
            "The updated profile picture id field must be an integer.",
        ),
];

module.exports = validateProfilePictureUpdate;
