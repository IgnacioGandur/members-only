const dbInteractions = require("../db/queries");

const usersController = {
    async usersGet(req, res) {
        const users = await dbInteractions.getAllUsers();
        res.render("pages/users", {
            users: users,
            user: req.user,
        });
    },
};

module.exports = usersController;
