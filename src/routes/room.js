const express = require('express');
const router = express.Router();

const RoomController = require('../controllers/roomController');

router.get('/get', RoomController.getRooms);
router.post('/add', RoomController.createRoom);

module.exports = router;
