const logoutController = {
    logoutGet(req, res) {
        req.logout((error) => {
            if (error) {
                return next(error);
            }

            return res.redirect("/login");
        });
    },
};

module.exports = logoutController;
