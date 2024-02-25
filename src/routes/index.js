const userRoutes = require('./user');

const route = (app) => {
    app.use('/api/user', userRoutes);
};

module.exports = route;
