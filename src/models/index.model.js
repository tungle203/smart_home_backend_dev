const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../db.sqlite'),
    logging: false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user.model')(sequelize, DataTypes);
db.room = require('./room.model')(sequelize, DataTypes);
db.device = require('./device.model')(sequelize, DataTypes);
db.deviceType = require('./deviceType.model')(sequelize, DataTypes);
db.sensor = require('./sensor.model')(sequelize, DataTypes);
db.sensorType = require('./sensorType.model')(sequelize, DataTypes);
db.log = require('./log.model')(sequelize, DataTypes);
db.event = require('./event.model')(sequelize, DataTypes);

db.user.hasMany(db.room);
db.room.belongsTo(db.user);

// db.user.hasMany(db.deviceType);
// db.deviceType.belongsTo(db.user);

db.user.hasMany(db.device);
db.device.belongsTo(db.user);

db.user.hasMany(db.log);
db.log.belongsTo(db.user);

// db.user.hasMany(db.sensorType);
// db.sensorType.belongsTo(db.user);

db.user.hasMany(db.sensor);
db.sensor.belongsTo(db.user);

db.user.hasMany(db.event);
db.event.belongsTo(db.user);

db.sensorType.hasMany(db.sensor);
db.sensor.belongsTo(db.sensorType);

db.room.hasMany(db.device);
db.device.belongsTo(db.room);

db.deviceType.hasMany(db.device);
db.device.belongsTo(db.deviceType);

db.device.hasMany(db.event);
db.event.belongsTo(db.device);

db.sensor.hasMany(db.log);
db.log.belongsTo(db.sensor);

db.sensor.hasMany(db.event);
db.event.belongsTo(db.sensor);

db.sequelize.sync();

module.exports = db;
