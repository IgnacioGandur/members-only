const dbInteractions = require("../db/queries");

const indexController = {
    async indexGet(req, res) {
        const messages = await dbInteractions.getAllMessages();
        res.render("pages/index", {
            user: req.user,
            messages: messages,
        });
    },
};

module.exports = indexController;
