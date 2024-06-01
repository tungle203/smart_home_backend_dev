const path = require('path');
const fs = require('fs');
const brain = require('brain.js');
const escapeHtml = require('escape-html');

const AdafruitService = require('../services/adafruit.service');
const PredictService = require('../services/predict.service');

const db = require('../models/index.model');
const Sensor = db.sensor;
const SensorType = db.sensorType;
const sequelize = db.sequelize;

class SensorController {
    constructor() {
        this.predictModelInterval = setInterval(
            async () => {
                try {
                    PredictService.predicts(5);
                } catch (error) {
                    console.log(error);
                }
            },
            5 * 24 * 60 * 60 * 1000,
        );
    }

    destroy() {
        clearInterval(this.predictModelInterval);
    }

    async getSensorType(req, res) {
        try {
            const sensorType = await SensorType.findAll({
                where: {
                    deleted: false,
                },
            });
            res.status(200).json(sensorType);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async createSensorType(req, res) {
        let { name, upperThreshold, lowerThreshold, description } = req.body;
        name = escapeHtml(name);
        description = escapeHtml(description);
        if (!name || !upperThreshold || !lowerThreshold) {
            return res
                .status(400)
                .json({ message: 'Please provide all required fields' });
        }
        try {
            const sensorType = await SensorType.create({
                name,
                upperThreshold,
                lowerThreshold,
                description,
                UserId: req.userId,
            });
            res.status(201).json(sensorType);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async updateSensorType(req, res) {
        const { id } = req.params;
        let { name, upperThreshold, lowerThreshold, description } = req.body;
        name = escapeHtml(name);
        description = escapeHtml(description);
        if (name === undefined) {
            return res.status(400).json({ error: 'Name is required' });
        }
        try {
            const sensorType = await SensorType.findByPk(id);
            if (
                !sensorType ||
                sensorType.UserId !== req.userId ||
                sensorType.deleted
            ) {
                return res.status(404).json({ error: 'Sensor type not found' });
            }
            await sensorType.update({
                name: name ?? sensorType.name,
                upperThreshold: upperThreshold ?? sensorType.upperThreshold,
                lowerThreshold: lowerThreshold ?? sensorType.lowerThreshold,
                description: description ?? sensorType.description,
            });
            res.status(200).json(sensorType);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async deleteSensorType(req, res) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Id is required' });
        }
        try {
            const sensorType = await SensorType.findByPk(id);
            if (
                !sensorType ||
                sensorType.UserId !== req.userId ||
                sensorType.deleted
            ) {
                return res.status(404).json({ error: 'Sensor type not found' });
            }
            await sensorType.update({ deleted: true });
            res.sendStatus(204);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async createSensor(req, res) {
        let { name } = req.body;
        name = escapeHtml(name);
        const { sensorTypeId } = req.body;
        if (!name || !sensorTypeId) {
            return res
                .status(400)
                .json({ message: 'Please provide all required fields' });
        }
        try {
            const sensor = await Sensor.create(
                {
                    name,
                    feedName: '',
                    SensorTypeId: sensorTypeId,
                    UserId: req.userId,
                },
            );

            const feedName = name.toLowerCase().replace(/ /g, '-');
            sensor.feedName = feedName + '-' + sensor.id + '-sensor';
            await sensor.save();
            await AdafruitService.createFeedInGroup(
                sensor.feedName,
                req.userName,
            );
            res.status(201).json(sensor);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getSensors(req, res) {
        try {
            const sensor = await Sensor.findAll({
                where: {
                    deleted: false,
                    UserId: req.userId,
                },
            });
            res.status(200).json(sensor);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async getCurrentSensorData(req, res) {
        res.set({
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/event-stream',
            Connection: 'keep-alive',
        });
        res.flushHeaders();

        const sendData = async () => {
            try {
                const sensor = await Sensor.findAll({
                    where: {
                        deleted: false,
                        UserId: req.userId,
                    },
                });
                
                const data = await Promise.all([
                    AdafruitService.getLastFeedData(req.userName, sensor[0].feedName),
                    AdafruitService.getLastFeedData(req.userName, sensor[1].feedName),
                ])

                const lastData = {
                    temperature: data[0][0].value,
                    humidity: data[1][0].value,
                }

                sensor[0].value = lastData.temperature;
                sensor[1].value = lastData.humidity;

                await sensor[0].save();
                await sensor[1].save();

                res.write(`data: ${JSON.stringify(lastData)}\n\n`);
            } catch (error) {
                console.log(error);
            }
        }
        sendData();

        const getDataInterval = setInterval(
            sendData
        , 30000);

        res.on('close', () => {
            clearInterval(getDataInterval);
            res.end();
        });
    }

    async getSensorData(req, res) {
        
        try {
            const sensor = await Sensor.findAll({
                where: {
                    UserId: req.userId,
                },
            })
            const inputDate = req.query.date
            const [day, month, year] = inputDate.split('/');
            let startTime
            let endTime
            let resolution

            const today = new Date()
            today.setHours(0, 0, 0, 0)
            if(today.getTime() === new Date(year, month - 1, day).getTime()) {
                startTime = new Date(new Date().getTime() - 12 * 60 * 60 * 1000).toUTCString();
                endTime = new Date().toUTCString();
                resolution = 60
            } else {
                startTime = new Date(year, month - 1, day, 0, 0, 0).toUTCString();
                endTime = new Date(year, month - 1, day, 23, 59, 59).toUTCString();
                resolution = 120
            }

            const data = await Promise.all([
                AdafruitService.getDataChart(
                    req.userName,
                    sensor[0].feedName,
                    startTime,
                    endTime,
                    resolution,
                ),
                AdafruitService.getDataChart(
                    req.userName,
                    sensor[1].feedName,
                    startTime,
                    endTime,
                    resolution,
                ),
            ]);

            res.status(200).json({ temperature: data[0].data, humidity: data[1].data});
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async updateSensor(req, res) {
        const { id } = req.params;
        const { upperThreshold, lowerThreshold } = req.body;
        try {
            const sensor = await Sensor.findByPk(id);
            if (!sensor || sensor.UserId !== req.userId || sensor.deleted) {
                return res.status(404).json({ error: 'Sensor not found' });
            }
            await sensor.update({
                upperThreshold: upperThreshold ?? sensor.upperThreshold,
                lowerThreshold: lowerThreshold ?? sensor.lowerThreshold,
            });
            res.status(200).json(sensor);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async deleteSensor(req, res) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Id is required' });
        }
        try {
            const sensor = await Sensor.findByPk(id);
            if (!sensor || sensor.UserId !== req.userId || sensor.deleted) {
                return res.status(404).json({ error: 'Sensor not found' });
            }

            await sensor.update({ deleted: true });
            res.sendStatus(204);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async predict(req, res) {
        const { id } = req.params;
        const predictTime = req.query.predictTime || 3;
        if (!id) {
            return res.status(400).json({ error: 'Id sensor are required' });
        }
        try {
            const sensor = await Sensor.findByPk(id);
            if (!sensor || sensor.UserId !== req.userId || sensor.delete) {
                return res.status(404).json({ error: 'Sensor not found' });
            }
            const directoryPath = path.join(
                __dirname,
                `../models/predict/${req.userName}/${sensor.feedName}.json`,
            );

            if (!fs.existsSync(directoryPath)) {
                return res
                    .status(404)
                    .json({ error: 'Predict model not found' });
            }

            const json = JSON.parse(fs.readFileSync(directoryPath, 'utf8'));
            const net = new brain.recurrent.LSTMTimeStep().fromJSON(json);
            const output = net.run([
                PredictService.convertDateToNum(
                    new Date(
                        new Date().getTime() + predictTime * 60 * 60 * 1000,
                    ),
                ),
            ]);
            return res
                .status(200)
                .json({ predictValue: output, predictTime, sensor });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new SensorController();
