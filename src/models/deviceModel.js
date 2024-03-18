const Room = require('./roomModel');
const DeviceType = require('./deviceTypeModel');

module.exports = (sequelize, DataTypes) => {
    const Device = sequelize.define('Device', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    });

    return Device;
}