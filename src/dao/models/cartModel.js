const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const model = mongoose.model;
const Types = mongoose.Types;

const cartSchema = new Schema({
    products: {
        type: [{
            product: {
                type: Types.ObjectId,
                ref: "product"
            },
            quantity: Number            
        }],
        default: []
    }
});

cartSchema.pre("findOne", function () {
    this.populate("products.product");
});

const cartModel = model("cart", cartSchema);

module.exports = cartModel;