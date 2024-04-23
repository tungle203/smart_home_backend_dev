const express = require('express');
const router = express.Router();

const authentication = require('../middlewares/auth');
const AuthController = require('../controllers/auth.controller');

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/logout', authentication, AuthController.logout);
module.exports = router;
