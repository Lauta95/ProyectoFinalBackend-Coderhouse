import CartModel from "../DAO/mongoManager/models/cart.model.js";
import ProductModel from "../DAO/mongoManager/models/product.model.js";
import { getTickets } from "./ticket.service.js";
import { updateStock } from './product.service.js'
import cartModel from "../DAO/mongoManager/models/cart.model.js";

export const findService = async () => {
    const result = await CartModel.find()
    return result;
}

export const findOneService = async (cid) => {
    const result = await CartModel.findById(cid).populate('products.productId')
    console.log(cid);
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
        const product = await ProductModel.findById(pid);
        cart.products.push({
            productId: pid,
            title: product.title,
            price: product.price,
            quantity: parseInt(quantity, 10),
        });
    }

    const result = await cart.save();
    const updatedCart = await CartModel.findOne({ _id: cid }).populate('products.productId');
    return updatedCart;
    // para ir al carrito una vez agregado:
}

export const deleteCartService = async (cid, pid) => {
    const cart = await CartModel.findOne({ _id: cid });

    cart.products = cart.products.filter((product) => product.productId.toString() === pid);

    const result = await cart.save();
    return result
}

export const deleteAllService = async (cid) => {
    const result = await CartModel.deleteOne({ _id: cid });
    return result;
}

export const addToCartService = async (cid, productId, quantity) => {
    try {
        const cart = await CartModel.findOne({ _id: cid });

        if (!cart) {
            throw new Error('Cart not found');
        }

        const product = await ProductModel.findById(productId);

        if (!product) {
            throw new Error('Product not found');
        }


        const existingProductIndex = cart.products.findIndex((item) => item.productId.toString() === productId);

        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({
                productId,
                quantity
            });
        }

        return updatedCart;
    } catch (error) {
        throw new Error('Error adding product to cart: ' + error.message);
    }
};

export const purchaseCartService = async (user, cartId) => {
    const tickets = await getTickets();
    const codeOne = tickets.length
    const nextCode = codeOne ? codeOne + 1 : 1
    const cart = await findOneService(cartId)
    const ticket = {}
    const purchase_datetime = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
    const productsNotAvailable = []
    ticket.purchase_datetime = purchase_datetime
    ticket.code = nextCode
    ticket.purchaser = user.user.email
    ticket.products = []
    ticket.amount = 0
    for (const p of cart.products) {

        if (p.quantity < p.productId.stock) {
            ticket.amount += p.productId.price * p.quantity
            const newStock = p.productId.stock - p.quantity
            await updateStock(p.productId._id, newStock)
            ticket.products.push(p)
        } else {
            productsNotAvailable.push(p)
        }
    }
    console.log(ticket);
    if (productsNotAvailable.length > 0) {
        cart.products = cart.products.filter(product => {
            return productsNotAvailable.includes(product)
        })
    }
    console.log('CART!: ', cart);
    console.log(productsNotAvailable);
    cart.save()
}

// modificar el modelo de ticket, y agregarle un array de productos. con esto se ven los productos que se compraron. hacer un cart.save().


//     try {
//agregar lo que FALTA ACÁ
// AGREGAR EL ARRAY DE PRODCUTOS AL MODELO DE TICKETS
//    const newTickets = await ticketsModel({ code: nextCode, purchase_datetime: purchase_datetime, purchase: user._id });
// AGREGAR ESTO AL MODELO DE TICKETS
// products: {
//     type: [],
//     default: []
// },


//         // if (product.stock < quantity) {
//         //     throw new Error('Insufficient stock');
//         // }

//         // const updatedCart = await cart.save();

//         // product.stock -= quantity;

//         // await product.save();


//         newTickets.save();
//         console.log(newTickets);
//         return { success: true, message: "Ticket creado con exito" }
//     } catch (error) {
//         return { success: false, message: "Ocurrio un error: " + error.message }
//     }
// }

// 