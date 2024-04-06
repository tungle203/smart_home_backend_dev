const AdafruitService = require('../services/adafruit.service');

const db = require('../models/index.model');
const Device = db.device;
const Room = db.room;
const DeviceType = db.deviceType;

class DeviceController {
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

    async getDevices(req, res) {
        try {
            const lastFeedValue = await AdafruitService.getLastDataGroup(
                req.userName,
            );
            const devices = await Device.findAll({
                where: { UserId: req.userId },
            });
            devices.forEach(async (device, index) => {
                const feedValue = lastFeedValue.find(
                    (feed) => feed.name === device.feedName,
                );
                if (
                    feedValue.last_value &&
                    device.value !== feedValue.last_value
                ) {
                    const newStatus =
                        feedValue.last_value === '0' ? false : true;
                    devices[index].status = newStatus;
                    devices[index].value = feedValue.last_value;
                    await device.update({
                        status: newStatus,
                        value: feedValue.last_value,
                    });
                }
            });
            return res.status(200).json(devices);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getDevice(req, res) {
        const { id } = req.params;
        const days = req.query.days || 5;
        const resolution = req.query.resolution;
        if (!id) {
            return res.status(400).json({ error: 'Id device is required' });
        }
        try {
            const device = await Device.findByPk(id);
            if (!device || device.UserId !== req.userId) {
                return res.status(404).json({ error: 'Device not found' });
            }
            const startTime = new Date(
                new Date().getTime() - days * 24 * 60 * 60 * 1000,
            ).toUTCString();
            const endTime = new Date().toUTCString();

            const data = await AdafruitService.getDataChart(
                req.userName,
                device.feedName,
                startTime,
                endTime,
                resolution,
            );
            return res.status(200).json({ device, data: data.data });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async createDevice(req, res) {
        const { name, roomId, deviceTypeId } = req.body;
        if (!name || !roomId || !deviceTypeId) {
            return res
                .status(400)
                .json({ error: 'Name, roomId and deviceTypeId are required' });
        }
        try {
            const deviceType = await DeviceType.findByPk(deviceTypeId);
            if (!deviceType) {
                return res.status(404).json({ error: 'Device type not found' });
            }
            const room = await Room.findByPk(roomId);
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }
            await room.update({ deviceCount: room.deviceCount + 1 });

            const device = await Device.create({
                name,
                feedName: "",
                RoomId: roomId,
                DeviceTypeId: deviceTypeId,
                UserId: req.userId,
            });

            const feedName = name.toLowerCase().replace(/ /g, '-');
            device.feedName = req.userName + '-' + feedName + '-' + device.id;
            await AdafruitService.createFeedInGroup(device.feedName, req.userName);
            await device.save();
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
            await AdafruitService.createData(
                req.userName,
                device.feedName,
                feedValue,
            );
            await device.update({ status });
            return res.sendStatus(200);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async controlFanSpeed(req, res) {
        const { id } = req.params;
        const { speed } = req.body;
        if (!id || !speed) {
            return res
                .status(400)
                .json({ error: 'Id device and speed are required' });
        }
        try {
            const device = await Device.findByPk(id);
            const deviceType = await DeviceType.findByPk(device.DeviceTypeId);
            if (deviceType.name !== 'Fan') {
                return res
                    .status(400)
                    .json({ error: 'This device is not a fan' });
            }

            if (!device || device.UserId !== req.userId) {
                return res.status(404).json({ error: 'Device not found' });
            }
            const feedValue = speed;
            await AdafruitService.createData(
                req.userName,
                device.feedName,
                feedValue,
            );
            return res.sendStatus(200);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new DeviceController();
