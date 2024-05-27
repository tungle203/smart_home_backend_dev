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
        upperThreshold: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        lowerThreshold: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    });
    return Sensor;
};
