const express = require('express');
const router = express.Router();

const DeviceController = require('../controllers/device.controller');
const authentication = require('../middlewares/auth');

router.get('/type', authentication, DeviceController.getDeviceType);
router.post('/type', authentication, DeviceController.createDeviceType);
router.put('/type/:id', authentication, DeviceController.updateDeviceType);
router.delete('/type/:id', authentication, DeviceController.deleteDeviceType);
router.get('/data/:id', authentication, DeviceController.getDeviceData);
router.put('/control/:id', authentication, DeviceController.controlDevice);
router.put('/:id', authentication, DeviceController.updateDevice);
router.get('/:id', authentication, DeviceController.getDeviceInfo);
router.delete('/:id', authentication, DeviceController.deleteDevice);
router.get('/', authentication, DeviceController.getDevices);
router.post('/', authentication, DeviceController.createDevice);
module.exports = router;
