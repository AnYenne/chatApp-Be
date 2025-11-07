const jwt = require('jsonwebtoken');
const User = require('../models/user.model')

const  authMiddleware = async (req, res, next) => {
   try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];     

        if(!token){
            return res.status(401).json({message:'unauthorized - no token provided'});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message: 'unanthorized - token is invalid'})
        }
        const user = await User.findById(decoded.userId).select('-password')
        if(!user) return res.status(401).json({message:'user not found'})
        req.user = user;
        next()
        
   } catch (error) {
        console.log(error)
        res.status(500).json({message: 'server error'})    
   }

}
module.exports = authMiddleware;