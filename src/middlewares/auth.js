const jwt = require('jsonwebtoken');
require('dotenv').config();

// const auth = (req, res, next) => {
//     const apiKey = req.header('X-API-KEY');
//     if (!apiKey || apiKey !== process.env.API_KEY) {
//         return res.status(403).send('Unauthorized');
//     }
//     next();
// };

// module.exports = auth;

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send('Access Denied');
    }

    try {
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decode.userId;
        req.userName = decode.userName;
        next();
    } catch (error) {
        if(error instanceof jwt.TokenExpiredError) {
            return res.status(401).send('Token Expired');
        }
        res.status(400).send('Invalid Token');
    }
};

module.exports = verifyToken;