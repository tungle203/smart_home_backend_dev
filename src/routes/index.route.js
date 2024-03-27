const roomRoute = require('./room.route');
const deviceRoute = require('./device.route');
const deviceTypeRoute = require('./deviceType.route');
const userRoute = require('./user.route');
const route = (app) => {
    app.use('/api/room', roomRoute);
    app.use('/api/device', deviceRoute);
    app.use('/api/device-type', deviceTypeRoute);
    app.use('/api', userRoute);
};

module.exports = route;
