const jwt = require('jsonwebtoken');
require('dotenv').config();

const authentication = (req, res, next) => {
    // const sessionId = req.cookies.sessionID;
    // if (!sessionId) {
    //     return res.status(401).send('Access Denied');
    // }
    // const session = req.session[sessionId];
    // if (!session) {
    //     return res.status(401).send('Invalid Session');
    // }
    // req.userId = session.userId;
    // req.userName = session.userName;

    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    try {
        const decode = jwt.verify(token, process.env.TOKEN_SECRET);
        req.userId = decode.userId;
        req.userName = decode.userName;
        next();
    } catch (error) {
        return res.status(401).send('Invalid Token');
    };
};

module.exports = authentication;
