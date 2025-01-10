const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true
    },
    roomtype: {
        type: String,
        required: true
    },
    roomcapacity: {
        type: Number,
    },
})

module.exports = mongoose.model('Room', roomSchema);