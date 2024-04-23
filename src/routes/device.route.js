const express = require('express');
const router = express.Router();

const DeviceController = require('../controllers/device.controller');
const authentication = require('../middlewares/auth');

router.get('/type', authentication, DeviceController.getDeviceType);
router.post('/type', authentication, DeviceController.createDeviceType);
router.get('/data/:id', authentication, DeviceController.getDeviceData);
router.put('/:id', authentication, DeviceController.controlDevice);
router.get('/:id', authentication, DeviceController.getDeviceInfo);
router.get('/', authentication, DeviceController.getDevices);
router.post('/', authentication, DeviceController.createDevice);
module.exports = router;
