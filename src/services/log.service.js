const AdafruitService = require('./adafruit.service');

const db = require('../models/index.model');
const Log = db.log;
const Sensor = db.sensor;
const SensorType = db.sensorType;
const User = db.user;

class LogService {
    async createLogWhenExceedingThreshold(
        userId,
        sensorId,
        value,
        lowerMessage,
        upperMessage,
        date,
        lower,
        upper,
    ) {
        if (value < lower) {
            return await Log.create({
                message: lowerMessage,
                value: value,
                date: date,
                UserId: userId,
                SensorId: sensorId,
            });
        }
        if (value > upper) {
            return await Log.create({
                message: upperMessage,
                value: value,
                date: date,
                UserId: userId,
                SensorId: sensorId,
            });
        }
    }

    async createLogs() {
        const logs = [];

        const sensorTypes = await SensorType.findAll();

        const users = await User.findAll();
        for (const user of users) {
            const sensors = await Sensor.findAll({
                where: { UserId: user.id },
            });
            for (const sensor of sensors) {
                const data = await AdafruitService.getDataChart(
                    user.userName,
                    sensor.feedName,
                    new Date(new Date().getTime() - 30000).toUTCString(),
                    new Date().toUTCString(),
                );

                if(data.data.length !== 0) {
                    await sensor.update({
                        value: data.data[data.data.length - 1][1],
                    });
                }
                const sensorType = sensorTypes.find(
                    (sensorType) => sensorType.id === sensor.SensorTypeId,
                );
                for (const dataPoint of data.data) {
                    const value = dataPoint[1];
                    const date = new Date(dataPoint[0]);
                    const log = await this.createLogWhenExceedingThreshold(
                        user.id,
                        sensor.id,
                        value,
                        `The value of the sensor ${sensor.name} is below the lower threshold of ${sensorType.lowerThreshold}`,
                        `The value of the sensor ${sensor.name} is above the upper threshold of ${sensorType.upperThreshold}`,
                        date,
                        sensorType.lowerThreshold,
                        sensorType.upperThreshold,
                    );
                    if (log) {
                        logs.push(log);
                    }
                }
            }
        }

        return logs;
    }
}

module.exports = new LogService();
