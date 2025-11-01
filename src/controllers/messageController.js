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

}

module.exports = new MessageController;