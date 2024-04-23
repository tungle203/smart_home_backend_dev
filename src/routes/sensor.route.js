const express = require('express');
const router = express.Router();

const authentication = require('../middlewares/auth');
const SensorController = require('../controllers/sensor.controller');

router.get('/type', authentication, SensorController.getSensorType);
router.post('/type', authentication, SensorController.createSensorType);
router.get('/predict/:id', authentication, SensorController.predict);
router.get('/data/:id', authentication, SensorController.getSensorData);
// router.get('/:id', authentication, SensorController.getSensorData);
router.post('/', authentication, SensorController.createSensor);
router.get('/', authentication, SensorController.getSensors);
module.exports = router;
