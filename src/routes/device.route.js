const express = require('express');
const router = express.Router();

const DeviceController = require('../controllers/device.controller');
const verifyToken = require('../middlewares/auth');

router.put('/toggle/:id', verifyToken, DeviceController.toggleStatus);
router.put('/fan/:id', verifyToken, DeviceController.controlFanSpeed);
router.get('/:id', verifyToken, DeviceController.getDevice);
router.get('/', verifyToken, DeviceController.getDevices);
router.post('/', verifyToken, DeviceController.createDevice);
module.exports = router;
