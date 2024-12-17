const checkAuthentication = require("../middleware/checkAuthentication");

const notFoundController = {
    notFoundPageGet: [
        checkAuthentication,
        (req, res) => {
            res.render("pages/404", {
                user: req.user,
            });
        },
    ],
};

module.exports = notFoundController;
