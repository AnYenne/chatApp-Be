const express = require('express');
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/direct',authMiddleware, messageController.sendMessage)


module.exports = router;