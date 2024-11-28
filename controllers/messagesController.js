const dbInteractions = require("../db/queries");

const messagesController = {
    async messagesGet(req, res) {
        const messages = await dbInteractions.getAllMessages();
        res.render("pages/messages", {
            messages: messages,
            user: req.user,
            pageTitle: "Messages",
        });
    },
};

module.exports = messagesController;
