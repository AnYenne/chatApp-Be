const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController')

    router.get('/:slug', userController.getData);
    router.get('/', userController.getDataAll);


module.exports = router;