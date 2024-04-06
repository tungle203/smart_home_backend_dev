module.exports = (sequelize, DataTypes) => {
    const Room = sequelize.define('Room', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        deviceCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    });
    return Room;
};
