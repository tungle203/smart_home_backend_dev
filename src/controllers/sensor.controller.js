const path = require('path');
const fs = require('fs');
const brain = require('brain.js');

const AdafruitService = require('../services/adafruit.service');
const PredictService = require('../services/predict.service');

const db = require('../models/index.model');
const Sensor = db.sensor;
const SensorType = db.sensorType;
const User = db.user;
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
                    UserId: req.userId,
                },
            });
            res.status(200).json(sensorType);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async createSensorType(req, res) {
        const { name, upperThreshold, lowerThreshold, description } = req.body;
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

    async createSensor(req, res) {
        const { name, sensorTypeId } = req.body;
        if (!name || !sensorTypeId) {
            return res
                .status(400)
                .json({ message: 'Please provide all required fields' });
        }
        try {
            const sensor = await Sensor.create({
                name,
                feedName: '',
                SensorTypeId: sensorTypeId,
                UserId: req.userId,
            });

            const feedName = name.toLowerCase().replace(/ /g, '-');
            sensor.feedName = feedName + '-' + sensor.id + '-sensor';
            await AdafruitService.createFeedInGroup(
                sensor.feedName,
                req.userName,
            );
            await sensor.save();
            res.status(201).json(sensor);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getSensors(req, res) {
        try {
            const sensor = await Sensor.findAll({
                where: {
                    UserId: req.userId,
                },
            });
            res.status(200).json(sensor);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async getSensorData(req, res) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Id sensor are required' });
        }
        const days = req.query.days || 5;
        const resolution = req.query.resolution;

        try {
            const sensor = await Sensor.findByPk(id);
            if (!sensor || sensor.UserId !== req.userId) {
                return res.status(404).json({ error: 'Sensor not found' });
            }
            const startTime = new Date(
                new Date().getTime() - days * 24 * 60 * 60 * 1000,
            ).toUTCString();
            const endTime = new Date().toUTCString();

            const data = await AdafruitService.getDataChart(
                req.userName,
                sensor.feedName,
                startTime,
                endTime,
                resolution,
            );
            res.status(200).json({ sensor, data: data.data });
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
            if (!sensor || sensor.UserId !== req.userId) {
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
