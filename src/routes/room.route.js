const express = require('express');
const router = express.Router();

const authentication = require('../middlewares/auth');
const RoomController = require('../controllers/room.controller');

router.get('/', authentication, RoomController.getRooms);
router.post('/', authentication, RoomController.createRoom);

module.exports = router;
