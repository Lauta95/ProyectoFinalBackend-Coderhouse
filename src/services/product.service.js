import productModel from "../DAO/mongoManager/models/product.model.js";
import ErrorObject from "../helpers/error.js";

export const limitService = async (limit) => {
    return await ProductModel.find().limit(limit);
}

export const findByIdService = async (id) => {
    const product = await ProductModel.findById(id);
    if (!product) {
        throw new ErrorObject('no existe el producto', 404)
    }
    return product
}

export const createService = async (title, description, code, price, status, stock, category, thumbnails) => {
    if (!(title && description && code && price && stock && category && thumbnails)) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const data = {
        title,
        description,
        code,
        price,
        status: status ?? true,
        stock,
        category,
        thumbnails
    }
    const result = await ProductModel.create(data)
    return result;
}

export const updateOneService = async () => {
    
}