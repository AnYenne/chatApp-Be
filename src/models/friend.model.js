const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    
    userA: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true,
    },
    userB: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true,
    },
      createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }

}, {
    timestamps: true
})

//tạo pre để chuẩn hóa schema khi truy vấn 
friendSchema.pre('save', function (next) {
    const a =  this.userA.toString();
    const b = this.userB.toString();
    if(a > b){
        this.userA = new mongoose.Types.ObjectId(b)
        this.userB = new mongoose.Types.ObjectId(a)
    }
    next();
})
// Todo xem lại pre cách truy vấn, và sắp xếp index
friendSchema.index({userA:1 , userB: 1}, {unique: true})

const Friend =  mongoose.model('Friend', friendSchema)
module.exports = Friend;