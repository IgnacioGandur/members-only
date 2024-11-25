const logoutController = {
    logoutGet(req, res) {
        req.logout((error) => {
            if (error) {
                return next(error);
            }

            return res.redirect("/");
        });
    },
};

module.exports = logoutController;
