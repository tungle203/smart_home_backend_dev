const AdafruitService = require('../services/adafruit.service');
const db = require('../models/index.model');

const Device = db.device;
const Room = db.room;
const DeviceType = db.deviceType;
const User = db.user;

class DeviceController {
    async getDevices(req, res) {
        try {
            const lastFeedValue = await AdafruitService.getLastDataGroup(req.userName);
            const devices = await Device.findAll();
            devices.forEach(async (device, index) => {
                const feedValue = lastFeedValue.find(feed => feed.name === device.feedName);
                const newStatus = feedValue.last_value === '0' ? false : true;
                devices[index].status = newStatus
                await device.update({ status: newStatus });
            });
            return res.json(devices);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async createDevice(req, res) {
        const { name, roomId, deviceTypeId } = req.body;
        if (!name || !roomId || !deviceTypeId) {
            return res.sendStatus(400)
        }
        try {
            const room = await Room.findByPk(roomId);
            if (!room) {
                return res.sendStatus(404)
            }
            const deviceType = await DeviceType.findByPk(deviceTypeId);
            if (!deviceType) {
                return res.sendStatus(404)
            }
            const feedName = name.toLowerCase().replace(/ /g, '-');
            await AdafruitService.createFeedInGroup(feedName, req.userName)

            const device = await Device.create({ name, feedName, RoomId: roomId, DeviceTypeId: deviceTypeId, UserId: req.userId})
            return res.status(201).json(device);
        } catch (error) {
            return res.sendStatus(500)
        }
    }

    async toggleStatus(req, res) {
        const { id } = req.params;
        if (!id) {
            return res.sendStatus(400)
        }
        try {
            const device = await Device.findByPk(id);
            if (!device || device.UserId !== req.userId) {
                return res.sendStatus(404)
            }
            const status = !device.status;
            const feedValue = status ? 1 : 0;
            await AdafruitService.createData(req.userName, device.feedName, feedValue)
            await device.update({ status });
            return res.sendStatus(200)
        } catch (error) {
            return res.sendStatus(500)
        }
    }
}

module.exports = new DeviceController();
