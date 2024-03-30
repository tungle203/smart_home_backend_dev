const express = require('express');
const router = express.Router();

const DeviceTypeController = require('../controllers/deviceType.controller');
const verifyToken = require('../middlewares/auth');
router.get('/get', verifyToken, DeviceTypeController.getDeviceType);
router.post('/add', verifyToken, DeviceTypeController.createDeviceType);

module.exports = router;
