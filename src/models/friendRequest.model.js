const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema({
   
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        maxlength: 300, // giới hạn 300 kí tự tránh spam
    },
     createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }

}, { timestamps: true}
);

friendRequestSchema.index({from:1, to: 1}, {unique: true}) // đảm bảo cặp from-to la duy nhất
friendRequestSchema.index({from:1}) // truy vấn nhanh các lời mời đã gửi
friendRequestSchema.index({to: 1}) // truy vấn các lời mời đã nhận


const FriendRequest =  mongoose.model('FriendRequest', friendRequestSchema);
module.exports = FriendRequest;

