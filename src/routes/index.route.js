const roomRoute = require('./room.route');
const deviceRoute = require('./device.route');
const sensorRoute = require('./sensor.route');
const userRoute = require('./user.route');
const logRoute = require('./log.route');
const route = (app) => {
    app.use('/api/rooms', roomRoute);
    app.use('/api/devices', deviceRoute);
    app.use('/api/sensors', sensorRoute);
    app.use('/api/logs', logRoute);
    app.use('/api', userRoute);
};

module.exports = route;
