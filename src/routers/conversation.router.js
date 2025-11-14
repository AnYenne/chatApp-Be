const express = require('express');
const conversationController = require('../controllers/conversationController');
const authMiddleware = require('../middleware/auth.middleware');
const {checkFriendShip, checkGroupMembership} = require('../middleware/friend.middleware');
const router = express.Router();


router.get('/:conversationId/message', conversationController.getMessage)
router.get('/', conversationController.getConversations)
router.post('/', checkFriendShip, conversationController.createConversation)

module.exports = router