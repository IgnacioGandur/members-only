const validateMessageDeletion = require("../validators/validateMessageDeletion");
const { deleteMessage } = require("../db/queries");

const deleteMessageController = {
    deleteMessagePost: [
        validateMessageDeletion,
        async (req, res) => {
            const { messageId } = req.body;
            await deleteMessage(messageId);
            return res.redirect("/");
        },
    ],
};

module.exports = deleteMessageController;
