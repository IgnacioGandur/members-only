const setActiveLink = require("../middleware/setActiveLink");

const aboutController = {
    aboutGet: [
        setActiveLink,
        (req, res) => {
            res.render("pages/about", { user: req.user });
        },
    ],
};

module.exports = aboutController;
