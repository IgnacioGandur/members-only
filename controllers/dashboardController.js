const dashboardController = {
    dashboardGet: (req, res) => {
        res.render("pages/dashboard", {
            user: req.user,
        });
    },
};

module.exports = dashboardController;
