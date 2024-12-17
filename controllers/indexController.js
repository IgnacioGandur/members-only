const { getAllMessages, getMessagesSorted } = require("../db/queries");
const validateMessagesSort = require("../validators/validateMessagesSort");

const indexController = {
    async indexGet(req, res) {
        const messages = await getAllMessages();
        res.render("pages/index", {
            user: req.user,
            messages: messages,
        });
    },

    sortMessages: [
        validateMessagesSort,
        async (req, res) => {
            const { sortBy } = req.query;
            const sortedMessages = await getMessagesSorted(sortBy);
            res.render("pages/index", {
                user: req.user,
                messages: sortedMessages,
                sortingMessages: `Sorting messages by ${sortBy === "ASC" ? "oldest" : "newest"}.`,
            });
        },
    ],
};

module.exports = indexController;
