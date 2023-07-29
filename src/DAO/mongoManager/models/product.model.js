import mongoose from "mongoose";

export const productModel = mognoose.model('products', productSchema({
    name: {type: String, require: true},
    stock: Number,
    price: Number
}))

export default productModel