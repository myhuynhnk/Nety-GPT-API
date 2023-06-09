const { Schema, model } = require('mongoose');

const ConversationSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    sessionID: {
        type: String,
    },
    message: {
        type: String,
        required: true,
    },
    reply: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
})

module.exports = model('conversations', ConversationSchema);