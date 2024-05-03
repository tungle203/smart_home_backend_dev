require('dotenv').config();
const session = require('express-session');
const Redis = require('ioredis');
const RedisStore = require('connect-redis').default;
const clientRedis = new Redis({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }
});

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
