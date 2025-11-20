const User = require('../models/user.model');

class UserController {
    async getData(req, res){
        try {
            const user = req.user
            if(!user){
                return res.status(401).json({message: 'failed auth and user not found'})
            }
            return res.status(200).json({user})

        } catch (error) {
            console.log(error)
            return res.status(500).json({message:'server get data error'})
        }
    }
    async searchUser (req, res) {
        try {
            const username = req.query.username;
            if(!username){
                return res.status(400).json({message: 'query is required'})
            }
            const user = await User.find({
                $or:[
                    {username: {$regex: username, $options: 'i'}},
                    {bio: {$regex: username, $options: 'i'}},
                ]
        }).select('username avatarUrl bio');
            if(!user){
                return res.status(401).json({message: 'username is invalid'})
            } 
            return res.status(200).json({message: 'successfully find a username',user})
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'server error'})
            
        }
    }
    getDataAll(req, res){
        res.send('data all user')
    }
    

}
module.exports = new UserController;