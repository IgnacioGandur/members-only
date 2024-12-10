const { getProfilePicturesPath, insertUser } = require("../db/queries");
const registerUserValidator = require("../validators/validateNewUser");

const registerController = {
    async registerGet(req, res) {
        const profilePictures = await getProfilePicturesPath();

        res.render("pages/register", {
            profilePictures: profilePictures,
        });
    },

    registerPost: [
        registerUserValidator,
        async (req, res) => {
            const {
                firstName,
                lastName,
                username,
                bio,
                password,
                gender,
                profilePicture,
            } = req.body;

            await insertUser(
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
