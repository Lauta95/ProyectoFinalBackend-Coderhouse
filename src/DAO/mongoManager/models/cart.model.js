import mongoose from "mongoose";

const cartModel = mongoose.model('carts', new mongoose.Schema({
    products: {
        type: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            quantity: Number,
        }],
        default:[]
    }
}))

export default cartModel