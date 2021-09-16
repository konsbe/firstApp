const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ReviewUsed = require('./reviewUsed')

const usedSchema = new Schema({
    
        name: String,
        date: Number,
        image: String, 
        price: String,
        category: String,
        subcategory: String,
        size: String,
        company: String,
        firm: String,
        description: String,
        reviews: [
                {
                type: Schema.Types.ObjectId,
                ref: 'ReviewUsed'
                }
        ]
})


usedSchema.post('findOneAndDelete', async function (doc) {
        if (doc) {
                await ReviewUsed.remove({
                        _id: {
                                $in: doc.reviews
                        }
                })
        }
})



module.exports = mongoose.model('usedProducts', usedSchema);