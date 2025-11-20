const Message = require('../models/message.model')
const User = require('../models/user.model')
const Conversation = require('../models/conversation.model')
const { updateConversationAfterCreateMessage } = require('../lib/utils')


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
            const { conversationId, content } = req.body;
            const sendId = req.user._id;
            const conversation = req.conversation;

            if (!content) {
              return res.status(400).json("Thiếu nội dung");
            }

          const message = await Message.create({
            conversationId,
            sendId,
            content,
          });

          updateConversationAfterCreateMessage(conversation, message, sendId);

          await conversation.save();

          return res.status(201).json({ message });

          } catch (error) {
            console.error("Lỗi xảy ra khi gửi tin nhắn nhóm", error);
            return res.status(500).json({ message: "Lỗi hệ thống" });
          }
        }
}

module.exports = new MessageController;