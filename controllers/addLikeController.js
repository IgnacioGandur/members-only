const dbInteractions = require("../db/queries");

const addLikeController = {
    async addLikePost(req, res) {
        const { messageId, userId } = req.body;
        await dbInteractions.addLike(messageId, userId);

        res.redirect("/messages");
    },
};

module.exports = addLikeController;
