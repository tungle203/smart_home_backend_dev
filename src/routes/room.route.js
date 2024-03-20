const express = require('express');
const router = express.Router();

const RoomController = require('../controllers/room.controller');

router.get('/get', RoomController.getRooms);
router.post('/add', RoomController.createRoom);

module.exports = router;
