const express = require('express');
const router = express.Router();

const LogController = require('../controllers/log.controller');
const authentication = require('../middlewares/auth');

router.get('/', authentication, LogController.getLogs);
module.exports = router;
