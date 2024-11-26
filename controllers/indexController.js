const indexController = {
    async indexGet(req, res) {
        res.render("pages/index", {
            user: req.user,
        });
    },
};

module.exports = indexController;
