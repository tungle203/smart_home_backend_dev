const express = require('express');
const router = express.Router();

const authentication = require('../middlewares/auth');
const SensorController = require('../controllers/sensor.controller');

router.get('/type', authentication, SensorController.getSensorType);
// router.post('/type', authentication, SensorController.createSensorType);
// router.put('/type/:id', authentication, SensorController.updateSensorType);
// router.delete('/type/:id', authentication, SensorController.deleteSensorType);
router.get('/predict/:id', authentication, SensorController.predict);
router.get('/data', authentication, SensorController.getCurrentSensorData);
router.get('/data/:id', authentication, SensorController.getSensorData);
router.put('/:id', authentication, SensorController.updateSensor);
router.delete('/:id', authentication, SensorController.deleteSensor);
router.post('/', authentication, SensorController.createSensor);
router.get('/', authentication, SensorController.getSensors);
module.exports = router;
