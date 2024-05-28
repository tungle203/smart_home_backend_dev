const roomRoute = require('./room.route');
const deviceRoute = require('./device.route');
const sensorRoute = require('./sensor.route');
const authRoute = require('./auth.route');
const logRoute = require('./log.route');
const userRoute = require('./user.route');
const route = (app) => {
    app.use('/api/rooms', roomRoute);
    app.use('/api/devices', deviceRoute);
    app.use('/api/sensors', sensorRoute);
    app.use('/api/logs', logRoute);
    app.use('/api/users', userRoute);
    app.use('/api', authRoute);
};

module.exports = route;
