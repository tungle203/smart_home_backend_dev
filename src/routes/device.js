const express = require('express');
const router = express.Router();

const DeviceController = require('../controllers/deviceController');

router.get('/get', DeviceController.getDevices);
router.post('/add', DeviceController.createDevice);

module.exports = router;