const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const kiteProductsSchema = new Schema({
    
        name: String,
        image: String, 
        price: String,
        category: String,
        subcategory: String,
        size: String,
        company: String,
        firm: {
                type: Schema.Types.ObjectId,
                ref: 'Firm'
        },
        description: String,
        reviews: [
                {
                type: Schema.Types.ObjectId,
                ref: 'Review'
                }
        ]
})


kiteProductsSchema.post('findOneAndDelete', async function (doc) {
        if (doc) {
                await Review.remove({
                        _id: {
                                $in: doc.reviews
                        }
                })
        }
})



module.exports = mongoose.model('kiteProducts', kiteProductsSchema);






