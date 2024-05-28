const escapeHtml = require('escape-html');

const db = require('../models/index.model');
const Room = db.room;
const Device = db.device;

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
