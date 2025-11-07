const Message = require('../models/message.model')


class MessageController {
    async sendMessage (req, res){
        const user = req.user
        const {participantId,content} =req.body
        try {
            if(!participantId || !content){
                return res.status(400).json({message: 'needed participantId and content'})
            }
            //check conversation của createdid và participantid đã có chưa
            //để lúc đó check conversation là rỗng hay đã có
            //conversation rỗng thì tạo mới
            //conversation có thì chuyển message qua conversation đó.

            //ở dưới đang tạo 1 sendId và receivedId ( thay đổi trong model) để test nhận message
            const message = new Message ({
                // conversationId: [],
                sendId: user._id,
                receiveId: participantId,
                content,
            })
            await message.save()
            return res.status(200).json({ content, message: 'thanh cong gui'})
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({message:'server send message error'})
            
            
        }
    }
    //tao 1 basic get messages from A and B
    async getMessages(req, res){
        const {userBId} = req.body
        const userAId = req.user._id
        
        try {
            if(!userBId){
                return res.status(400).json({message: 'missed receiver id'})
            }
            const message = await Message.find({
                $or: [
                    {sendId:userAId, receiveId: userBId },
                    {sendId:userBId, receiveId: userAId },
                ]
            })

            return res.status(200).json(message)
            
        } catch (error) {
            console.log(error)
            return res.status(500).json("server get message error")
        }

    }

}

module.exports = new MessageController;