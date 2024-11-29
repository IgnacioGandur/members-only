function setActiveLink(req, res, next) {
    res.locals.currentPath = req.originalUrl;
    next();
}

module.exports = setActiveLink;
