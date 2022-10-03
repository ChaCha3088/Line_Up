function loginRequired(req, res, next) {
    if (!req.user) {
        res.redirect('/');
        return;
    }
    next();
}