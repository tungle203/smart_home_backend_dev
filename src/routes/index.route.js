const roomRoute = require('./room.route');
const deviceRoute = require('./device.route');
const deviceTypeRoute = require('./deviceType.route');
const route = (app) => {
    app.use('/api/room', roomRoute);
    app.use('/api/device', deviceRoute);
    app.use('/api/device-type', deviceTypeRoute);
};

module.exports = route;
