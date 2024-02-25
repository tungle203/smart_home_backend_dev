const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/get', userController.showUser);
router.post('/add', userController.addUser);

module.exports = router;
