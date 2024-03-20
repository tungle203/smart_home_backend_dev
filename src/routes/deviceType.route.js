const express = require('express');
const router = express.Router();

const DeviceTypeController = require('../controllers/deviceType.controller');

router.get('/get', DeviceTypeController.getDeviceType);
router.post('/add', DeviceTypeController.createDeviceType);

module.exports = router;
