import CartModel from "../DAO/mongoManager/models/cart.model.js";

export const findService = async () => {
    const result = await CartModel.find()
    return result;
}

export const findOneService = async (cid) => {
    const result = await CartModel.findOne({ _id: cid }).populate('products.productId')
    return result;
}

export const createService = async () => {
    const result = await CartModel.create({ products: [] })
    return result
}

export const findOneBodyService = async (cid, products) => {
    const cart = await CartModel.findOne({ _id: cid })
    cart.products = products;

    const result = await cart.save();
    return result;
}

export const pidBodyService = async (cid, pid, quantity) => {
    const cart = await CartModel.findOne({ _id: cid });

    const existingProduct = cart.products.find((product) => product.id === pid);
    if (existingProduct) {
        existingProduct.quantity = parseInt(quantity, 10);
    }

    const result = await cart.save();
    return result;
}

export const productDetailsService = async (cid, pid, quantity) => {
    const cart = await CartModel.findOne({ _id: cid });

    const existingProduct = cart.products.find((product) => product.productId === pid);
    if (existingProduct) {
        existingProduct.quantity += parseInt(quantity, 10);
    } else {
        cart.products.push({ productId: pid, quantity: parseInt(quantity, 10) });
    }

    const result = await cart.save();
    const updatedCart = await CartModel.findOne({ _id: cid }).populate('products.productId');
    return result;
    // para ir al carrito una vez agregado:
}

export const deleteCartService = async (cid, pid) => {
    const cart = await CartModel.findOne({ _id: cid });

    cart.products = cart.products.filter((product) => product.productId.toString() === pid);

    const result = await cart.save();
    return result
}

export const deleteAllService = async(cid) => {
    const result = await CartModel.deleteOne({ _id: cid });
    return result;
}