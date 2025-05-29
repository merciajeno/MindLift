const mongoose = require('mongoose')

const JournalEntrySchema = new mongoose.Schema(
    {
        text:{
            type: String,
        required: true},
        date:{
            type: Date,
            default: Date.now
        }
    }
)
module.exports = mongoose.model('Journal',JournalEntrySchema,'journal')