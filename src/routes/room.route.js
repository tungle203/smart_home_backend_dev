const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/auth');
const RoomController = require('../controllers/room.controller');

router.get('/get', verifyToken, RoomController.getRooms);
router.post('/add', RoomController.createRoom);

module.exports = router;
