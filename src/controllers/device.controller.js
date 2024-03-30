const AdafruitService = require('../services/adafruit.service');
const db = require('../models/index.model');
const { where } = require('sequelize');

const Device = db.device;
const Room = db.room;
const DeviceType = db.deviceType;
const User = db.user;

class DeviceController {
    async getDevices(req, res) {
        try {
            const lastFeedValue = await AdafruitService.getLastDataGroup(req.userName);
            const devices = await Device.findAll({
                where: { UserId: req.userId },
            });
            devices.forEach(async (device, index) => {
                const feedValue = lastFeedValue.find(feed => feed.name === device.feedName);
                const newStatus = feedValue.last_value === '0' ? false : true;
                devices[index].status = newStatus
                await device.update({ status: newStatus });
            });
            return res.status(200).json(devices);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async createDevice(req, res) {
        const { name, roomId, deviceTypeId } = req.body;
        if (!name || !roomId || !deviceTypeId) {
            return res.status(400).json({ error: 'Name, roomId and deviceTypeId are required' });
        }
        try {
            const room = await Room.findByPk(roomId);
            if (!room) {
                return res.status(404).json({ error: 'Room not found' })
            }
            const deviceType = await DeviceType.findByPk(deviceTypeId);
            if (!deviceType) {
                return res.status(404).json({ error: 'Device type not found' })
            }
            const feedName = name.toLowerCase().replace(/ /g, '-');
            await AdafruitService.createFeedInGroup(feedName, req.userName)

            const device = await Device.create({ name, feedName, RoomId: roomId, DeviceTypeId: deviceTypeId, UserId: req.userId})
            return res.status(201).json(device);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async toggleStatus(req, res) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Id device are required' });
        }
        try {
            const device = await Device.findByPk(id);
            if (!device || device.UserId !== req.userId) {
                return res.status(404).json({ error: 'Device not found' });
            }
            const status = !device.status;
            const feedValue = status ? 1 : 0;
            await AdafruitService.createData(req.userName, device.feedName, feedValue)
            await device.update({ status });
            return res.sendStatus(200)
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new DeviceController();
