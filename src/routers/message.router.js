const express = require('express');
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth.middleware');
const {checkFriendShip, checkGroupMembership} = require('../middleware/friend.middleware');
const router = express.Router();

router.post('/direct',checkFriendShip, messageController.sendDirectMessage)
router.post('/group',checkGroupMembership, messageController.sendGroupMessage)


module.exports = router;