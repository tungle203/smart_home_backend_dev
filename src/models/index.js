const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../db.sqlite')
});

const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.room = require('./roomModel')(sequelize, DataTypes);
db.deviceType = require('./deviceTypeModel')(sequelize, DataTypes);
db.device = require('./deviceModel')(sequelize, DataTypes);

db.room.hasMany(db.device);
db.device.belongsTo(db.room);

db.deviceType.hasMany(db.device);
db.device.belongsTo(db.deviceType);

db.sequelize.sync();

module.exports = db
