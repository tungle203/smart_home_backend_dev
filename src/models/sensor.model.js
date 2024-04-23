module.exports = (sequelize, DataTypes) => {
    const Sensor = sequelize.define('Sensor', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        value: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        feedName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
    });
    return Sensor;
};
