const Friend = require( "../models/friend.model")
const User = require( "../models/user.model")
const FriendRequest = require("../models/friendRequest.model");

class FriendController {
    async addFriend (req, res) {
        const { to, message} = req.body;
        try {
            const from = req.user._id
            // if the same person
            if(from.toString() === to.toString()){
                return res.status(400).json({message: 'can not send a request for yourself'})
            }
            //check the user exist
            const userExisted = await User.findOne({_id: to})
            if(!userExisted){
                return res.status(404).json({message: 'user is not existed'})
            }
            let userA = from.toString()            
            let userB = to.toString()
            
            if(userA > userB){
                [userA, userB] = [userB, userA];
            }
            
            const [alreadyFriends, existingRequest] = await Promise.all([
                Friend.findOne({userA, userB}),
                FriendRequest.findOne({
                    $or: [
                        {from, to},
                        {from: to, to: from}
                    ]
                })
            ])

            if(alreadyFriends){
                return res.status(400).json({message: 'already friend'})
            }

            
            if(existingRequest){
                return res.status(400).json({message: 'a request is waiting accept'})
            }
            const request = await FriendRequest.create({
                from,
                to,
                message
            })

            return res.status(201).json({message: 'sent request successful'})

        } catch (error) {
            console.error('add friend error',error)
            return res.status(500).json({message: 'server request error'})
            
        }
    }
    async acceptFriendRequest (req, res) {
        try {
            const {requestId} = req.params;
            const userId = req.user._id;

            const request = await FriendRequest.findById(requestId);
            if(!request){
                return res.status(404).json({message: 'can not find friend request'})
            }
            if(request.to.toString() !== userId.toString()){
                return res.status(403).json({message: 'you cannot  accept auth'})
            } 
            const friend =  await Friend.create({
                userA: request.from,
                userB: request.to,
            })
            await FriendRequest.findOneAndDelete(requestId)

            const from = await User.findById(request.from).select(
                "_id username avatarUrl"
            ).lean() //select để lấy dữ liệu cần thiet, lean trả về js object thay vì mongodb docs

            return res.status(200).json({message: 'accept successfull',
                newfriend: {
                    _id: from?._id,
                    username: from?.username,
                    avatarUrl: from?.avatarUrl
                }
            })
            
        } catch (error) {
             console.error('accept friend error',error)
            return res.status(500).json({message: 'server request error'})
            
        }
    }
    async declineFriendRequest (req, res) {
        try {
            const {requestId} = req.params;
            const userId = req.user._id;

            const request = await FriendRequest.findById(requestId)
            if(!request){
                 return res.status(404).json({message: 'can not find friend request'})
            }
            if(request.to.toString() !== userId.toString()){
                 return res.status(403).json({message: 'not auth decline this request'})
            }
            await FriendRequest.findByIdAndDelete(requestId)
            return res.sendstatus(204)
            
        } catch (error) {
            console.error('decline friend error',error)
            return res.status(500).json({message: 'server request error'})
        }
    }
    async getAllFriends (req, res) {
        try {
            const userId = req.user._id;
            const friendShip = await Friend.find({
                $or:[   
                    {

                        userA: userId,
                    },
                    {
                        userB: userId
                    }
                ]
            })
            .populate("userA", "_id username avatarUrl")
            .populate("userB", "_id username avatarUrl")
            .lean()

            if(!friendShip.length){
               return res.status(200).json({friend: []}) 
            }
            const friends = friendShip.map((f) => f.userA._id.toString() === userId.toString() ? f.userB : f.userA )

            return res.status(200).json({friends})

        } catch (error) {
            console.error('get all friends error',error)
            return res.status(500).json({message: 'server request error'})
        }
    }
     async getFriendRequests (req, res) {
        try {
            const userId = req.user._id

            const populateField = '_id username avatarUrl';
            const [sent, received]  = await Promise.all([
                FriendRequest.find({from: userId}).populate('to', populateField),
                FriendRequest.find({to: userId}).populate('from', populateField)
            ]) 

            res.status(200).json({sent, received})


            
        } catch (error) {
            console.error('get friend requests error',error)
            return res.status(500).json({message: 'server request error'})
        }
    }


}
module.exports = new FriendController