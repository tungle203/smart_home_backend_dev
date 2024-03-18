const roomRoute = require('./room');
const deviceRoute = require('./device');
const deviceTypeRoute = require('./deviceType');
const route = (app) => {
    app.use('/api/room', roomRoute);
    app.use('/api/device', deviceRoute);
    app.use('/api/device-type', deviceTypeRoute);
};

module.exports = route;
