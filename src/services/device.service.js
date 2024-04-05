const brain = require('brain.js');
const fs = require('fs');

const AdafruitService = require('./adafruit.service');
const db = require('../models/index.model');
const path = require('path');
const Device = db.device;
const User = db.user;
const DeviceType = db.deviceType;
class DeviceService {
    convert(date) {
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        return hour * 3600 + minute * 60 + second;
    }

    cleanData(data) {
        const values = data.map((data) => parseFloat(data[1]));
        const mean = values.reduce((a, b) => a + b) / values.length;
        const stdDev = Math.sqrt(
            values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) /
                values.length,
        );

        const outlierThreshold = 3 * stdDev;

        const cleanData = data.forEach((data) => {
            const value = parseFloat(data[1]);

            if (Math.abs(value - mean) > outlierThreshold) {
                data[1] = mean;
            } else {
                data[1] = value;
            }
        });

        return cleanData;
    }

    async makePredictModel(userName, feedName, data) {
        const net = new brain.recurrent.LSTMTimeStep({
            inputSize: 1,
            hiddenLayers: [10],
            outputSize: 1,
        });

        const trainingData = data.map((data) => ({
            input: [this.convert(new Date(data[0]))],
            output: [data[1]],
        }));

        net.train(trainingData, {
            iterations: 5000,
        });
        const directoryPath = path.join(
            __dirname,
            `../models/predict/${userName}`,
        );
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }
        fs.writeFileSync(
            path.join(directoryPath, `${feedName}.json`),
            JSON.stringify(net.toJSON()),
        );
    }

    async predicts(deviceType, days) {
        const users = await User.findAll();
        const deviceTypes = await DeviceType.findAll({
            where: { name: deviceType },
        });
        users.forEach(async (user) => {
            const devices = await Device.findAll({
                where: {
                    UserId: user.id,
                    DeviceTypeId: deviceTypes.map(
                        (deviceType) => deviceType.id,
                    ),
                },
            });
            devices.forEach(async (device) => {
                const data = await AdafruitService.getDataChart(
                    user.userName,
                    device.feedName,
                    new Date(
                        new Date().getTime() - days * 24 * 60 * 60 * 1000,
                    ).toUTCString(),
                    new Date().toUTCString(),
                );
                if (data.data.length === 0) return;
                await this.makePredictModel(
                    user.userName,
                    device.feedName,
                    this.cleanData(data.data),
                );
                console.log(
                    `Predict model for ${device.feedName} of ${user.userName} is done`,
                );
            });
        });
    }
}

module.exports = new DeviceService();
