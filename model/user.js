const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        min: 7
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);