const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const Schema = mongoose.Schema;
const model = mongoose.model;

const productSchema = new Schema({
    title: String,
    description: String,
    code: {
        type: String,
        unique: true,
        required: true
    },
    price: Number,
    status: Boolean,
    category: {
        type: String,
        index: true
    },
    stock: Number,
    category: String,    
    thumbnails: [String]
});

productSchema.plugin(mongoosePaginate);

const productModel = model("product", productSchema);

module.exports = productModel;