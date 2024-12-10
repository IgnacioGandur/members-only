const checkAuthentication = require("../middleware/checkAuthentication");
const { insertNewMessage } = require("../db/queries");
const validateNewMessage = require("../validators/validateNewMessage");

const newMessageController = {
    newMessageGet: [
        checkAuthentication,
        async (req, res) => {
            res.render("pages/new-message", {
                user: req.user,
            });
        },
    ],

    newMessagePost: [
        validateNewMessage,
        async (req, res) => {
            const { title, content } = req.body;
            const { id } = req.user;
            await insertNewMessage(id, title, content);
            return res.redirect("/");
        },
    ],
};

module.exports = newMessageController;
