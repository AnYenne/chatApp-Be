const express = require('express');
const router = express.Router();

const authController = require('../controllers/AuthController');
const authMiddleware = require('../middleware/auth.middleware');
const AuthController = require('../controllers/AuthController');

    router.post('/signup', authController.signup);
    router.post('/logout', authController.logout);
    router.post('/login', authController.login);
    router.post('/refresh', authController.refresh);



module.exports = router;