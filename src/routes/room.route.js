const express = require('express');
const router = express.Router();

const authentication = require('../middlewares/auth');
const RoomController = require('../controllers/room.controller');

router.put('/:id', authentication, RoomController.updateRoom);
router.delete('/:id', authentication, RoomController.deleteRoom);
router.get('/', authentication, RoomController.getRooms);
router.post('/', authentication, RoomController.createRoom);

module.exports = router;
