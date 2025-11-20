const express = require('express');
const router = express.Router()
const friendController = require('../controllers/friendController');
const authMiddleware = require('../middleware/auth.middleware');

    router.post('/requests',authMiddleware, friendController.addFriend);
    router.post('/requests/:requestId/accept',authMiddleware, friendController.acceptFriendRequest);
    router.post('/requests/:requestId/decline',authMiddleware, friendController.declineFriendRequest);
    router.get('/',authMiddleware, friendController.getAllFriends);
    router.get('/requests',authMiddleware, friendController.getFriendRequests);
    

module.exports = router