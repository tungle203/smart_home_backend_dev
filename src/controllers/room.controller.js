const db = require('../models/index.model');

const Room = db.room;

class RoomController {
    async createRoom(req, res) {
        const { name } = req.body;
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
                    UserId: req.userId,
                },
            });
            return res.status(200).json(rooms);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new RoomController();
