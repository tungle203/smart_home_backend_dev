require('dotenv').config();

const auth = (req, res, next) => {
    const apiKey = req.header('X-API-KEY');
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(403).send('Unauthorized');
    }
    next();
};

module.exports = auth;
