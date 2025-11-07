const User = require('../models/user.model');
const Session = require('../models/session.model')
const bcrypt = require( 'bcryptjs');
const generateToken = require('../lib/utils')


class AuthController {
    async signup(req, res){     
   
    const {username, email, password} = req.body;
        try {
            if(!username || !email || !password){
                return res.status(400).json({message: 'all fields are required'})
            }
            
            if(password.length < 6){
                return res.status(400).json({message: 'password must be at least 6 characters'})
            } 
            
            const user = await User.findOne({username});
            if(user){
                return res.status(409).json({message: 'username already exists'})
            }
            const userEmail = await User.findOne({email});
            if(userEmail){
                return res.status(409).json({message: 'email already used'})
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);

            const newUser = new User({
                email,
                username,
                password:hashedPassword,
            })

            if(newUser){
                //generate jwt token and res
                const accessToken = generateToken(newUser._id,res);
                await newUser.save();
                return res.status(201).json({
                    message:'login successfully',
                    username: newUser.username,
                    accessToken,
                })
            } else{
                return res.status(404).json({message: 'unable create an account'});
            }
           
        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'server error'})
        }
    }
      
    async login(req, res){
        const {username, password} = req.body;
        try {
            if(!username || !password){
                return res.status(400).json({message: 'all fields are required'})
            }
            const user = await User.findOne({username})
            if(!user){
                return res.status(401).json({message: 'invalid username/password'})
            }
            const isPasswordCorrect = await bcrypt.compare(password,user.password);
            if(!isPasswordCorrect){
                return res.status(401).json({message: 'invalid username/password'})
            } else{
                const accessToken = await generateToken(user._id, res)
                
                return res.status(200).json({
                    message:'login successfully',
                    accessToken,
                })
            }
            
        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'server error'})            
        }

    }

    async logout(req, res){
        try {
            const token = req.cookies?.refreshToken
            if(token){ 
                const session = await Session.deleteOne({refreshToken: token})
                res.clearCookie('refreshToken')
            }
            res.sendStatus(204)
        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'server error'})            
            
        }
    }
    
}
module.exports = new AuthController;