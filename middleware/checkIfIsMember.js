function checkIfIsMember(req, res, next) {
    if (req.user.is_member) {
        return next();
    }

    return res.redirect(
        "/dashboard/account-status?errorMessage=" +
            encodeURIComponent(
                "You must be a member to visit the 'users' page or a user's profile.",
            ),
    );
}

module.exports = checkIfIsMember;
