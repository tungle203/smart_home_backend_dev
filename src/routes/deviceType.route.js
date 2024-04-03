const express = require('express');
const router = express.Router();

const DeviceTypeController = require('../controllers/deviceType.controller');
const verifyToken = require('../middlewares/auth');
router.get('/', DeviceTypeController.getDeviceType);
router.post('/', verifyToken, DeviceTypeController.createDeviceType);

module.exports = router;
