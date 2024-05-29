const escapeHtml = require('escape-html');

const AdafruitService = require('../services/adafruit.service');

const db = require('../models/index.model');
const Device = db.device;
const Room = db.room;
const DeviceType = db.deviceType;
const sequelize = db.sequelize;

class DeviceController {
    async getDeviceType(req, res) {
        try {
            const deviceTypes = await DeviceType.findAll({
                attributes: [['id', 'key'], ['name', 'value'], 'description'],
                where: {
                    deleted: false,
                },
            });
            return res.status(200).json(deviceTypes);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async createDeviceType(req, res) {
        let { name, description } = req.body;
        name = escapeHtml(name);
        description = escapeHtml(description);
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

    async updateDeviceType(req, res) {
        const { id } = req.params;
        let { name, description } = req.body;
        name = escapeHtml(name);
        description = escapeHtml(description);
        if (!id) {
            return res.status(400).json({ error: 'Id are required' });
        }
        try {
            const device = await DeviceType.findByPk(id);
            if (!device || device.UserId !== req.userId || device.deleted) {
                return res.status(404).json({ error: 'Device type not found' });
            }
            await device.update({
                name: name ?? device.name,
                description: description ?? device.description,
            });
            return res.status(200).json(device);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async deleteDeviceType(req, res) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Id are required' });
        }
        try {
            const device = await DeviceType.findByPk(id);
            if (!device || device.UserId !== req.userId || device.deleted) {
                return res.status(404).json({ error: 'Device type not found' });
            }
            await device.update({ deleted: true });
            return res.sendStatus(204);
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
                where: {
                    deleted: false,
                    UserId: req.userId,
                },
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

    async getDeviceInfo(req, res) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Id device is required' });
        }
        try {
            const device = await Device.findByPk(id);
            if (!device || device.UserId !== req.userId || device.deleted) {
                return res.status(404).json({ error: 'Device not found' });
            }
            const feedValue = await AdafruitService.getLastFeedData(
                req.userName,
                device.feedName,
            );

            const lastData = feedValue?.value;
            if (lastData !== undefined) {
                await device.update({
                    value: lastData,
                    status: lastData === '0' ? false : true,
                });
            }

            return res.status(200).json(device);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getDeviceData(req, res) {
        const { id } = req.params;
        const days = req.query.days || 5;
        const resolution = req.query.resolution;
        if (!id) {
            return res.status(400).json({ error: 'Id device is required' });
        }
        try {
            const device = await Device.findByPk(id);
            if (!device || device.UserId !== req.userId || device.deleted) {
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
            console.log(error);
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
        const t = await sequelize.transaction();
        try {
            const deviceType = await DeviceType.findByPk(deviceTypeId);
            if (
                !deviceType ||
                deviceType.deleted
            ) {
                return res.status(404).json({ error: 'Device type not found' });
            }
            const room = await Room.findByPk(roomId);
            if (!room || room.UserId !== req.userId || room.deleted) {
                return res.status(404).json({ error: 'Room not found' });
            }

            await room.update({ deviceCount: room.deviceCount + 1 });

            const device = await Device.create({
                name,
                feedName: '',
                RoomId: roomId,
                DeviceTypeId: deviceTypeId,
                UserId: req.userId,
            });

            const feedName = name.toLowerCase().replace(/ /g, '-');
            device.feedName = feedName + '-' + device.id + '-device';
            await AdafruitService.createFeedInGroup(
                device.feedName,
                req.userName,
            );
            await device.save();
            await t.commit();
            return res.status(201).json(device);
        } catch (error) {
            await t.rollback();
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updateDevice(req, res) {
        const { id } = req.params;
        const { name, roomId, deviceTypeId } = req.body;
        if (!id) {
            return res.status(400).json({ error: 'Id device is required' });
        }
        const t = await sequelize.transaction();
        try {
            const device = await Device.findByPk(id);
            if (!device || device.UserId !== req.userId || device.deleted) {
                return res.status(404).json({ error: 'Device not found' });
            }
            const room = await Promise.all([
                Room.findByPk(roomId),
                Room.findByPk(device.RoomId),
            ]);
            const newRoom = room[0];
            const oldRoom = room[1];

            if (!newRoom || newRoom.UserId !== req.userId || newRoom.deleted) {
                return res.status(404).json({ error: 'Room not found' });
            }
            const deviceType = await DeviceType.findByPk(deviceTypeId);
            if (
                !deviceType ||
                deviceType.UserId !== req.userId ||
                deviceType.deleted
            ) {
                return res.status(404).json({ error: 'Device type not found' });
            }

            const updateNewRoom = newRoom.update({
                deviceCount: newRoom.deviceCount + 1,
            });
            const updateOldRoom = oldRoom.update({
                deviceCount: oldRoom.deviceCount - 1,
            });
            await Promise.all([updateNewRoom, updateOldRoom]);

            await device.update({
                name: name ?? device.name,
                RoomId: roomId ?? device.RoomId,
                DeviceTypeId: deviceTypeId ?? device.DeviceTypeId,
            });

            await t.commit();
            return res.status(200).json(device);
        } catch (error) {
            await t.rollback();
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async deleteDevice(req, res) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Id device is required' });
        }
        const t = await sequelize.transaction();
        try {
            const device = await Device.findByPk(id);
            if (!device || device.UserId !== req.userId || device.deleted) {
                return res.status(404).json({ error: 'Device not found' });
            }
            const room = await Room.findByPk(device.RoomId);
            if (!room || room.UserId !== req.userId || room.deleted) {
                return res.status(404).json({ error: 'Room not found' });
            }

            await room.update(
                { deviceCount: room.deviceCount - 1 },
                { transaction: t },
            );
            await device.update({ deleted: true }, { transaction: t });

            await t.commit();
            return res.sendStatus(204);
        } catch (error) {
            await t.rollback();
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async controlDevice(req, res) {
        const { id } = req.params;
        const { status } = req.body;
        if (!id || status === undefined) {
            return res
                .status(400)
                .json({ error: 'Id device and status are required' });
        }
        if (!id) {
            return res
                .status(400)
                .json({ error: 'Id device and value are required' });
        }
        try {
            const device = await Device.findByPk(id);
            if (!device || device.UserId !== req.userId || device.deleted) {
                return res.status(404).json({ error: 'Device not found' });
            }
            const deviceType = await DeviceType.findByPk(device.DeviceTypeId);
            const defaultValue = status ? deviceType.defaultValue : 0;
            await AdafruitService.createData(
                req.userName,
                device.feedName,
                defaultValue,
            );
            await device.update({ status });
            return res.sendStatus(200);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new DeviceController();
