const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
   
    // conversationId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Conversation',
    //     required: true,
    // },
    sendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    //tạo tạm receive id thay cho bước conversation
    receiveId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date
    }
}, {
    timestamps: true
})

const Message =  mongoose.model('Message', messageSchema);
module.exports = Message;