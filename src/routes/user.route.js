const express = require('express');
const router = express.Router();

const authentication = require('../middlewares/auth');
const UserController = require('../controllers/user.controller');

router.get('/info', authentication, UserController.getUserInfo);
router.put('/update', authentication, UserController.updateUser);
module.exports = router;