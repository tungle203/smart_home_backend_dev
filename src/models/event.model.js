module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
        value: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        
    });
    return Event;
};