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
        value: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        feedName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    });

    return Device;
};
