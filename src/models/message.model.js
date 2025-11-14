const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
   
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
        index:true,
    },
    sendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        trim: true,
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

    messageSchema.index({conversationId: 1, createdAt: -1})

const Message =  mongoose.model('Message', messageSchema);
module.exports = Message;