const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    avatarUrl: {
        type: String,
        default: "",
    },
    avatarId: {
        type: String,
    },
    bio: {
        type: String
    },
    active: {
        type: Boolean,
        defaut: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }

}, {timestamps: true}
)

const User = mongoose.model('User', userSchema);

module.exports = User;