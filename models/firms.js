const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./kitesurf');


const companySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    products: [
        {
        type: Schema.Types.ObjectId,
        ref: 'kiteProducts'
        }
    ]
})

companySchema.post('findOneAndDelete', async function (firm) {
    if (firm.products.length) {
        const result = await Product.deleteMany({_id: { $in: firm.products } })
    }
})



const Firm = mongoose.model('Firm', companySchema);

module.exports = Firm;