const db = require('../models');

const Room = db.room;

class RoomController {
    async createRoom(req, res) {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        try {
            const room = await Room.create({ name });
            return res.status(201).json(room);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async getRooms(req, res) {
        try {
            const rooms = await Room.findAll();
            return res.status(200).json(rooms);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new RoomController();