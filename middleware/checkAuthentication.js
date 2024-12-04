function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect(
        "/login?error=" +
            encodeURIComponent(
                `You must be logged in to see the "${req.originalUrl}" page.`,
            ),
    );
}

module.exports = checkAuthentication;
