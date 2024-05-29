const escapeHtml = require('escape-html');
require('dotenv').config();
const db = require('../models/index.model');
const Room = db.room;
const Device = db.device;
const AdafruitService = require('../services/adafruit.service');
const { parse } = require('dotenv');
class RoomController {
    async getDevicesInRoom(req, res) {
        const roomId = req.params.id;
        if (!roomId) {
            return res.status(400).json({ error: 'RoomId is required' });
        }
        try {
            const devices = await Device.findAll({
                where: {
                    RoomId: roomId,
                    UserId: req.userId,
                    deleted: false,
                },
            });
            return res.status(200).json(devices);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getDeviceDataStream(req, res) {
        const roomId = req.params.id;

        res.set({
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/event-stream',
            Connection: 'keep-alive',
        });
        res.flushHeaders();

        const sendData = async () => {
            try {
                const devices = await Device.findAll({
                    where: {
                        deleted: false,
                        UserId: req.userId,
                        RoomId: roomId,
                    },
                });
                
                const data = await Promise.all(devices.map(device => AdafruitService.getLastFeedData(req.userName,req.userName + '.' + device.feedName)))
                data.forEach(async item => {
                    const feedName = item[0].feed_key.split('.')[1];
                    const device = devices.find(device => device.feedName === feedName);
                    device.status = parseInt(item[0].value) ? true : false;
                    await device.save();
                })

                res.write(`data: ${JSON.stringify(devices)}\n\n`);
            } catch (error) {
                console.log(error);
            }
        }

        const getDataInterval = setInterval(
            sendData
        , 5000);

        res.on('close', () => {
            clearInterval(getDataInterval);
            res.end();
        });
    }

    async createRoom(req, res) {
        let { name } = req.body;
        name = escapeHtml(name);
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        if (name === 'Entire house') {
            return res.status(400).json({ error: 'Invalid name' });
        }
        try {
            const room = await Room.create({ name, UserId: req.userId });
            return res.status(201).json(room);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async getRooms(req, res) {
        try {
            const rooms = await Room.findAll({
                where: {
                    deleted: false,
                    UserId: req.userId,
                },
            });
            return res.status(200).json(rooms);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updateRoom(req, res) {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: 'Id is required' });
        }
        let { name } = req.body;
        name = escapeHtml(name);
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        try {
            const room = await Room.findByPk(id);
            if (!room || room.UserId !== req.userId || room.deleted) {
                return res.status(404).json({ error: 'Room not found' });
            }
            await room.update({ name });
            return res.status(200).json(room);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async deleteRoom(req, res) {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: 'Id is required' });
        }
        try {
            const room = await Room.findByPk(id);
            if (!room || room.UserId !== req.userId || room.deleted) {
                return res.status(404).json({ error: 'Room not found' });
            }
            await room.update({ deleted: true });
            return res.sendStatus(204);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new RoomController();
