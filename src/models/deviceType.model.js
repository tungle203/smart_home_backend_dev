module.exports = (sequelize, DataTypes) => {
    const DeviceType = sequelize.define('DeviceType', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });
    return DeviceType;
};
