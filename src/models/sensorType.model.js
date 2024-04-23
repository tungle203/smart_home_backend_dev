module.exports = (sequelize, DataTypes) => {
    const SensorType = sequelize.define('SensorType', {
        name: {
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
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });
    return SensorType;
};
