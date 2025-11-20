const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
},{
    _id: false
})

const groupSchema =  new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    _id: false
})

const lastMessageSchema = new mongoose.Schema({
    _id: {type: String}, // không phải id tự tạo mà id của tin nhắn gốc
    content: {
        type: String,
        default: null,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt:{
        type: Date,
        default: null,
    }

},{
    _id: false
})

const conversationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['direct', 'group'],
        required: true
    },
    participants : {
        type: [participantSchema],
        required: true,
    },
    group: {
        type:groupSchema
    },
    lastMessageAt: {
        type: Date,
    },
    seenBy: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    lastMessage: {
        type: lastMessageSchema,
        default: null,
    },
    unReadCounts: {
    type: Map,
    of: Number,
    default: {}
    }
}, {timestamps: true}
);

conversationSchema.index({
    "participants.userId": 1, //truy vấn user tăng dần
    lastMessageAt: -1, // tin nhắn cuối sẽ dc hiển thị đầu tiên
})

const Conversation =  mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;