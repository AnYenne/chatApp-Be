const express = require('express');
const router = express.Router();

const authController = require('../controllers/AuthController')

    router.get('/login', authController.login);
    router.get('/', authController.logout);


module.exports = router;