const Message = require('../models/message.model')
const User = require('../models/user.model')
const Conversation = require('../models/conversation.model')
const { updateConversationAfterCreateMessage } = require('../lib/utils')

//  async sendMessage (req, res){
//         const user = req.user
//         const {participantId,content} =req.body
//         try {
//             if(!participantId || !content){
//                 return res.status(400).json({message: 'needed participantId and content'})
//             }
//             //check conversation của createdid và participantid đã có chưa
//             //để lúc đó check conversation là rỗng hay đã có
//             //conversation rỗng thì tạo mới
//             //conversation có thì chuyển message qua conversation đó.

//             //ở dưới đang tạo 1 sendId và receivedId ( thay đổi trong model) để test nhận message
//             const message = new Message ({
//                 // conversationId: [],
//                 sendId: user._id,
//                 receiveId: participantId,
//                 content,
//             })
//             await message.save()
//             return res.status(200).json({ content, message: 'thanh cong gui'})
            
//         } catch (error) {
//             console.log(error)
//             return res.status(500).json({message:'server send message error'})
            
            
//         }
//     }
//     //tao 1 basic get messages from A and B
//     async getMessages(req, res){
//         const {userBId} = req.body
//         const userAId = req.user._id
        
//         try {
//             if(!userBId){
//                 return res.status(400).json({message: 'missed receiver id'})
//             }
//             const message = await Message.find({
//                 $or: [
//                     {sendId:userAId, receiveId: userBId },
//                     {sendId:userBId, receiveId: userAId },
//                 ]
//             })

//             return res.status(200).json(message)
            
//         } catch (error) {
//             console.log(error)
//             return res.status(500).json("server get message error")
//         }

//     }

class MessageController {
      async sendDirectMessage(req, res) {
        try {
          const {recipientId, content, imageUrl, conversationId} = req.body
          const sendId = req.user._id
          
          let conversation;
          // để direct check, bạn bè -> middleware
          // check có người nhận không -> middlware included
          // check content hoặc image Url có bị trống không
          // check conversationId có chưa
          // chưa có thì tạo mới
          if(!content && !imageUrl ){
            return res.status(400).json({message: 'content or image URL is required'})
          }
          
          if(conversationId){
            conversation = await Conversation.findById(conversationId )
          }
          if(!conversation){
            conversation = await Conversation.create({
              type: 'direct',
              participants: [
                {userId: sendId, joinedAt: new Date()},
                {userId: recipientId, joinedAt: new Date()}
              ],
              lastMessageAt: new Date(),
              unReadCounts: new Map()
            })
          }
          const newMessage = await Message.create({
            conversationId: conversation._id,
            content,
            imageUrl,
            sendId
          })

          // add update message to track seen, lastmessage...
          updateConversationAfterCreateMessage(conversation, newMessage, sendId)
          
          await conversation.save()

          return res.status(204).json({message: 'sent successfull a direct message', newMessage})

        } catch (error) {
            console.error(error)
            return res.status(500).json({message: 'server send direct message error'})
        }
      }
      async sendGroupMessage(req, res) {
        try {
            try {
    const { conversationId, content } = req.body;
    const senderId = req.user._id;
    const conversation = req.conversation;

    if (!content) {
      return res.status(400).json("Thiếu nội dung");
    }

    const message = await Message.create({
      conversationId,
      senderId,
      content,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);

    await conversation.save();

    return res.status(201).json({ message });
  } catch (error) {
    console.error("Lỗi xảy ra khi gửi tin nhắn nhóm", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }

            

        } catch (error) {
            console.error(error)
            return res.status(500).json({message: 'server send group message error'})
        }
      }
}

module.exports = new MessageController;