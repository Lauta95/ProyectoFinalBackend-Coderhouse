import mongoose from "mongoose";

const productModel = mongoose.model('products', new mongoose.Schema({
    code: {type: String, require: true},
    title: {type: String, require: true},
    description: {type: String, require: true},
    price: {type: Number, require: true},
    category: {type: String, require: true},
    thumbnails: {type: String, require: true},
    stock: {type: Number, require: true},
}))

export default productModel