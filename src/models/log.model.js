module.exports = (sequelize, DataTypes) => {
    const Log = sequelize.define('Log', {
        message: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        value: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    });

    return Log;
};
