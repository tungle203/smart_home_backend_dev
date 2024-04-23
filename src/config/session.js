const session = require('express-session');
const Redis = require('ioredis');
const RedisStore = require('connect-redis').default;
const clientRedis = new Redis();
require('dotenv').config();

const sessionConfig = {
    store: new RedisStore({ client: clientRedis }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
    },
};

module.exports = session(sessionConfig);
