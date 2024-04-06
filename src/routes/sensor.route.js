const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/auth');
const SensorController = require('../controllers/sensor.controller');

router.get('/type', verifyToken, SensorController.getSensorType);
router.post('/type', verifyToken, SensorController.createSensorType);
router.get('/predict/:id', verifyToken, SensorController.predict);
router.post('/', verifyToken, SensorController.createSensor);
module.exports = router;