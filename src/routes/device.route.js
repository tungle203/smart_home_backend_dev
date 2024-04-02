const express = require('express');
const router = express.Router();

const DeviceController = require('../controllers/device.controller');
const verifyToken = require('../middlewares/auth');

router.get('/get', verifyToken, DeviceController.getDevices);
router.post('/add', verifyToken, DeviceController.createDevice);
router.put('/toggle/:id', verifyToken, DeviceController.toggleStatus);
router.put('/fan/:id', verifyToken, DeviceController.controlFanSpeed);
module.exports = router;
