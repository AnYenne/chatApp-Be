const express = require('express');
const router = express.Router()
const friendController = require('../controllers/friendController')

    router.post('/requests', friendController.addFriend);
    router.post('/requests/:requestId/accept', friendController.acceptFriendRequest);
    router.post('/requests/:requestId/decline', friendController.declineFriendRequest);
    router.get('/', friendController.getAllFriends);
    router.get('/requests', friendController.getFriendRequests);
    

module.exports = router