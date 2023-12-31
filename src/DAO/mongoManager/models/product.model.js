import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new mongoose.Schema({
    code: { type: String, require: true },
    title: { type: String, require: true },
    description: { type: String, require: true },
    price: { type: Number, require: true },
    category: { type: String, require: true },
    thumbnails: { type: String, require: true },
    stock: { type: Number, require: true },
    owner:{
        type: String,
        default: 'admin'
    }
})

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model('products', productSchema)

export default productModel;