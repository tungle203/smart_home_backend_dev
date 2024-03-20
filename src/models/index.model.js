const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../db.sqlite'),
    logging: false
});

const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.room = require('./room.model')(sequelize, DataTypes);
db.deviceType = require('./deviceType.model')(sequelize, DataTypes);
db.device = require('./device.model')(sequelize, DataTypes);

db.room.hasMany(db.device);
db.device.belongsTo(db.room);

db.deviceType.hasMany(db.device);
db.device.belongsTo(db.deviceType);

db.sequelize.sync();

module.exports = db
