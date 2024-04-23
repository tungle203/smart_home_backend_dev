const authentication = (req, res, next) => {
    const sessionId = req.cookies.sessionID;
    if (!sessionId) {
        return res.status(401).send('Access Denied');
    }
    const session = req.session[sessionId];
    if (!session) {
        return res.status(401).send('Invalid Session');
    }
    req.userId = session.userId;
    req.userName = session.userName;
    next();
};

module.exports = authentication;
