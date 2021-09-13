const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    nickname: {
        type: String,
        default: "unknown"
    }
});

module.exports = mongoose.model('Review', reviewSchema);