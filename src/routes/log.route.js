const express = require('express');
const router = express.Router();

const LogController = require('../controllers/log.controller');
const verifyToken = require('../middlewares/auth');

router.get('/', verifyToken, LogController.getLogs);
module.exports = router;
