const AdafruitService = require('../services/adafruit.service');
const db = require('../models/index.model');

const Device = db.device;
const Room = db.room;
const DeviceType = db.deviceType;

class DeviceController {
    async getDevices(req, res) {
        try {
            const devices = await Device.findAll();
            return res.status(200).json(devices);
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
            await AdafruitService.createFeed(req.userName, name)
            const device = await Device.create({ name, RoomId: roomId, DeviceTypeId: deviceTypeId, UserId: req.userId})
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
            await AdafruitService.createData(req.userName, device.name, feedValue)
            await device.update({ status });
            return res.sendStatus(200)
        } catch (error) {
            return res.sendStatus(500)
        }
    }

    // note: vấn đề lấy trạng thái cuối cùng của thiết bị

}

module.exports = new DeviceController();
