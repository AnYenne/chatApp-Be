const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware')


const userController = require('../controllers/userController')

    router.get('/me',authMiddleware, userController.getData);
    router.get('/search',authMiddleware, userController.searchUser);
    router.get('/', userController.getDataAll);


module.exports = router;