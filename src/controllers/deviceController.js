const db = require('../models');

const Device = db.device;
const Room = db.room;
const DeviceType = db.deviceType;

class DeviceController {
    async createDevice(req, res) {
        const { name, status, roomId, deviceTypeId } = req.body;
        if (!name || !status || !roomId || !deviceTypeId) {
            return res.status(400).json({ error: 'Name, status, roomId, and deviceTypeId are required' });
        }
        try {
            const room = await Room.findByPk(roomId);
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }
            const deviceType = await DeviceType.findByPk(deviceTypeId);
            if (!deviceType) {
                return res.status(404).json({ error: 'Device type not found' });
            }
            const device = await Device.create({ name, status, RoomId: roomId, DeviceTypeId: deviceTypeId });
            return res.status(201).json(device);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async getDevices(req, res) {
        const roomId = req.query.roomId;
        try {
            const devices = await Device.findAll(
                {
                    where: { 
                        RoomId: roomId
                    },
                }
            );
            return res.status(200).json(devices);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new DeviceController();
