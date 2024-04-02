const AdafruitService = require('./adafruit.service');

const db = require('../models/index.model');
const Log = db.log;
const Device = db.device;
const DeviceType = db.deviceType;
const User = db.user;
const Room = db.room;

const getWarningFromFeed = async (userName, feedKey) => {
    const data = await AdafruitService.getDataChart(
        userName,
        feedKey,
        new Date(new Date().getTime() - 30000).toUTCString(),
        new Date().toUTCString(),
    );
    return data.data;
};

const createLog = async (userId, deviceId, message, value, date) => {
    const log = await Log.create({
        message: message,
        value: value,
        date: date,
        UserId: userId,
        DeviceId: deviceId,
    });
    return log;
};

const makeDeviceWarning = async (
    userId,
    deviceId,
    value,
    lowerMessage,
    upperMessage,
    date,
    lower,
    upper,
) => {
    if (value < lower) {
        return await createLog(userId, deviceId, lowerMessage, value, date);
    }
    if (value > upper) {
        return await createLog(userId, deviceId, upperMessage, value, date);
    }
};

const createLogs = async () => {
    const logs = [];

    const deviceTypes = await DeviceType.findAll();
    const humidityType = deviceTypes.find(
        (deviceType) => deviceType.name === 'Humidity',
    );
    const temperatureType = deviceTypes.find(
        (deviceType) => deviceType.name === 'Temperature',
    );

    const users = await User.findAll();
    for (const user of users) {
        const rooms = await Room.findAll({
            where: {
                UserId: user.id,
                name: 'Entire house',
            },
        });
        const devices = await Device.findAll({
            where: {
                UserId: user.id,
                RoomId: rooms[0].id,
            },
        });
        for (const device of devices) {
            const data = await getWarningFromFeed(
                user.userName,
                device.feedName,
            );

            for (const dataPoint of data) {
                const value = dataPoint[1];
                const date = new Date(dataPoint[0]);
                if (device.DeviceTypeId === humidityType.id) {
                    const result = await makeDeviceWarning(
                        user.id,
                        device.id,
                        value,
                        'Humidity is too low',
                        'Humidity is too high',
                        date,
                        30,
                        70,
                    );
                    logs.push(result);
                }
                if (device.DeviceTypeId === temperatureType.id) {
                    const result = await makeDeviceWarning(
                        user.id,
                        device.id,
                        value,
                        'Temperature is too low',
                        'Temperature is too high',
                        date,
                        20,
                        30,
                    );
                    logs.push(result);
                }
            }
        }
    }

    return logs;
};

module.exports = {
    createLogs,
};
