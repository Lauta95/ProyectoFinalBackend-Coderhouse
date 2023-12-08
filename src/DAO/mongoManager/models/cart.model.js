import mongoose from "mongoose";

const cartModel = mongoose.model('carts', new mongoose.Schema({
    products: {
        type: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            title: String,
            price: Number,
            quantity: Number,
        }],
    }
}))

export default cartModel