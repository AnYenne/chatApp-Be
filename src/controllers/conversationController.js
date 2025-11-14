const Conversation = require('../models/conversation.model')
const Message =  require('../models/message.model')

class ConversationController {
    async getMessage (req, res){
        
        try {
            const {conversationId} = req.params;
            const {limit = 50, cursor} = req.query;

            const query = {conversationId};

            if(cursor){
                query.createAt = {$lt: new Date(cursor)};
            }
            let message =  await Message.find(query)
                .sort({createdAt: -1})
                .limit(Number(limit) + 1)

                let nextCursor = null;
                
                if(message.length > Number(limit)){
                    const nextMessage = message[message.length -1];
                    nextCursor =  nextMessage.createdAt.toISOString();
                    message.pop() 
                }

                message = message.reverse()

            return res.status(200).json({ messages, nextCursor})
            
        } catch (error) {
            console.log(error, "get message error")
            return res.status(500).json({message: 'server get messages error'})
        }
    }
    async createConversation(req, res){
        try {
            const{type, name, memberIds} = req.body
            const userId = req.user._id

            if(!type || (type === 'group' && !name) || !memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
                return res.status(400).json({message: 'req is required type and memberID'})
            } 
            let conversation;
            if(type == 'direct'){
                const participantId =  memberIds[0]
                conversation = await Conversation.findOne({
                    type: 'direct',
                    "participants.userId": {$all: [userId, participantId]},

                })
                if(!conversation){
                    conversation =  new conversation({
                        type: 'direct',
                        participants: [{userId}, {userId: participantId}],
                        lastMessageAt: new Date()
                    })
                }

                await conversation.save()

            }
            if(type === 'group'){
                conversation  =  new Conversation({
                    type: 'group',
                    participants: [{userId}, ...memberIds.map((id) => ({userId: id}))],
                    group: {
                        name,
                        createdBy: userId,
                    },
                    lastMessageAt: new Date()
                })

                await conversation.save()

            }
            if(!conversation){
                return res.status(400).json({message: 'conversation type invalid'})
            }
            await conversation.populate([
                {path: 'participants.userId', select: 'username avatarUrl' },
                {path: 'seenBy.userId', select: 'username avatarUrl' },
                {path: 'lastMesssage.senderId', select: 'username avatarUrl' },
            ])
            
            return res.status(200).json({ message: 'created a conversation', conversation})
            
        } catch (error) {
            console.log(error, "create conversation error")
            return res.status(500).json({message:'server create conversation error'})
        }
    }
    async getConversations(req, res){
    try {
        const userId = req.user._id
        const conversations =  await Conversation.find({
            "participants.userid": userId,
        })
        .sort({lastMessageAt: -1, updateAt:-1})
        .populate({
            path:"participants.userid", select:"username avatarUrl"
        })
        .populate({
            path:"lastMessage.senderId", select:"username avatarUrl"
        })
        .populate({
            path:"seenBy", select:"username avatarUrl"
        })

        const formatted = conversations.map((convo) => {
            const participants = (convo.participants || []).map((p) => ({
                _id: p.userId?._id,
                username: p.userId?.username,
                avatarUrl: p.userId?.avatarUrl,
                joinedAt: p.joinedAt,

            }))

            return {
                ...convo.toObject(),
                unReadCounts: convo.unReadCounts || [],
                participants,
            }
        })
        return res.status(200).json({conversations: formatted})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:'server get conversation error'})
    }
    }

}

module.exports = new ConversationController;