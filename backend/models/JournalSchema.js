const mongoose = require('mongoose')

const JournalEntrySchema = new mongoose.Schema(
    {
        text:{
            type: String,
        required: true},
        date:{
            type: Date,
            default: Date.now
        },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }
    }
)
module.exports = mongoose.model('Journal',JournalEntrySchema,'journal')