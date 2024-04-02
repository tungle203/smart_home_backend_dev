const db = require('../models/index.model');

const DeviceType = db.deviceType;

class DeviceTypeController {
    async createDeviceType(req, res) {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name are required' });
        }
        try {
            const device = await DeviceType.create({
                name,
                description,
                UserId: req.userId,
            });
            return res.status(201).json(device);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async getDeviceType(req, res) {
        try {
            const devices = await DeviceType.findAll();
            return res.status(200).json(devices);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new DeviceTypeController();
