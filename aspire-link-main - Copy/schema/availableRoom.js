const mongoose = require('mongoose');

const availRoomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true
    },
    users: {
        type: Array,
    },
    roomtype: {
        type: String,
        required: true
    },
    roomcapacity: {
        type: Number
    },
})

module.exports = mongoose.model('AvailRoom', availRoomSchema);