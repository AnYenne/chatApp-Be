const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Session = require('../models/session.model')

//generate token
const ACCESSTOKEN_TTL = '30s'
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
            await Session.deleteMany({userId})
        } 
        await Session.create({
            userId,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESHTOKEN_TTL),
        })
        
        await res.cookie('refreshToken',refreshToken, {
            maxAge: REFRESHTOKEN_TTL, //ms
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV !== 'development'
        });

    return accesstoken;
}


// update conversation
export const updateConversationAfterCreateMessage = (conversation, message, sendId) => {
        conversation.set({
            seendBy: [],
            lastMessageAt: message.createdAt,
            lastMessage: {
                _id: message._id,
                content: message.content || 'image',
                senderId: sendId,
                createdAt: message.createdAt
            }
        })

        conversation.participants.forEach((p) => {
            const memberID = p.userId.toString()
            const isSender = memberID === sendId.toString()
            const preCount = conversation.unReadCounts.get(memberID) || 0;
            conversation.unReadCounts.set(memberID, isSender ? 0 : preCount+1)
        })
}

module.exports = generateToken;