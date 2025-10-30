const User = require('../models/user.model');
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
                generateToken(newUser._id,res);
                await newUser.save();
                return res.status(201).json({
                    _id: newUser._id,
                    email: newUser.email,
                    username: newUser.username,
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
                generateToken(user._id, res)
                return res.status(200).json({
                    username: user.username,
                    email: user.email,
                    imageUrl: user.imageUrl
                })
            }
            
        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'server error'})            
        }

    }

    logout(req, res){
        try {
            res.cookie('jwt','', {
                maxAge: 0
            })
            res.status(200).json("logout successfully")
        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'server error'})            
            
        }
    }
    
}
module.exports = new AuthController;