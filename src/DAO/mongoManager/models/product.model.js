import mongoose from "mongoose";

const productModel = mongoose.model('products', new mongoose.Schema({
    title: {type: String, require: true},
    description: {type: String, require: true},
    code: {type: String, require: true},
    price: {type: Number, require: true},
    stock: {type: Number, require: true},
    thumbnails: {type: String, require: true},
}))

export default productModel