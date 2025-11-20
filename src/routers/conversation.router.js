const express = require('express');
const conversationController = require('../controllers/conversationController');
const authMiddleware = require('../middleware/auth.middleware');
const {checkFriendShip, checkGroupMembership} = require('../middleware/friend.middleware');
const router = express.Router();


router.get('/:conversationId/message',authMiddleware, conversationController.getMessage)
router.get('/',authMiddleware, conversationController.getConversations)
router.post('/', authMiddleware, checkFriendShip, conversationController.createConversation)

module.exports = router