const roomRoute = require('./room.route');
const deviceRoute = require('./device.route');
const deviceTypeRoute = require('./deviceType.route');
const userRoute = require('./user.route');
const logRoute = require('./log.route');
const route = (app) => {
    app.use('/api/rooms', roomRoute);
    app.use('/api/devices', deviceRoute);
    app.use('/api/device-types', deviceTypeRoute);
    app.use('/api/logs', logRoute);
    app.use('/api', userRoute);
};

module.exports = route;
