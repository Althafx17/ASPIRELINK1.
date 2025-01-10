const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Report', reportSchema)