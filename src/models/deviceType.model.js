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
        defaultValue: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    });
    return DeviceType;
};
