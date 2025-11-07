const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Session = require('../models/session.model')

const ACCESSTOKEN_TTL = '30m'
const REFRESHTOKEN_TTL = 7*24*60*60*1000
const  generateToken = async (userId, res) => {
    
    const accesstoken = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: ACCESSTOKEN_TTL
    });
    //tạo db session tự hủy sau khi freshtoken hết hạn trong db -> tạo model session
    // tạo refreshtoken lưu trong db
    // lưu refreshtoken lên cookies
    // accesstoken gửi cho client
        const refreshToken = crypto.randomBytes(64).toString('hex');
        // await Session.deleteOne({userId})
        const oldRefreshToken = await Session.findOne({userId})
        if(oldRefreshToken){
            await Session.deleteOne({userId})
        } 
        await Session.create({
            userId,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESHTOKEN_TTL),
        })
        
        await res.cookie('refreshToken',refreshToken, {
            maxAge: REFRESHTOKEN_TTL, //ms
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV !== 'development'
        });

    return accesstoken;
}

module.exports = generateToken;