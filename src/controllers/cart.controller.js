// import CartManager from '../DAO/fileManager/cart.service.js'
import CartModel from '../DAO/mongoManager/models/cart.model.js'



export const find = async (req, res) => {
    const result = await CartModel.find()
    res.send(result)
}

export const findOne = async (req, res) => {
    const cid = req.params.cid;

    // se agrega populate() para cargar los datos completos de los productos relacionados
    const cart = await CartModel.findOne({ _id: cid }).populate('products.productId')

    res.send(cart);
    console.log(cart);
}

export const create = async (req, res) => {
    const result = await CartModel.create({ products: [] })
    res.send(result)
}

// Nuevos endpoints de la segunda preentrega:

// para actualizar el carrito por id
export const findOneBody = async (req, res) => {
    const cid = req.params.cid;
    const { products } = req.body;

    const cart = await CartModel.findOne({ _id: cid })
    cart.products = products;

    const result = await cart.save();
    res.send(result);
}

// para poder actualizar solamente la cantidad de ejemplares del producto por cualquier cantidad pasada desde el req.body:
export const pidBody = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const { quantity } = req.body;

    const cart = await CartModel.findOne({ _id: cid });

    const existingProduct = cart.products.find((product) => product.id === pid);
    if (existingProduct) {
        existingProduct.quantity = parseInt(quantity, 10);
    }

    const result = await cart.save();
    res.send(result);
}

// POST PARA AGREGAR AL CARRITO CON EL BOTÓN DIRECTAMENTE Y ENTRANDO AL DETALLE DEL PRODUCTO (PRODUCTDETAILS.HANDLEBARS)
export const productDetails = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const cart = await CartModel.findOne({ _id: cid });

        const existingProduct = cart.products.find((product) => product.productId === pid);
        if (existingProduct) {
            existingProduct.quantity += parseInt(quantity, 10);
        } else {
            cart.products.push({ productId: pid, quantity: parseInt(quantity, 10) });
        }

        const result = await cart.save();

        // para ir al carrito una vez agregado:
        const updatedCart = await CartModel.findOne({ _id: cid }).populate('products.productId');
        res.render('cartDetails', { cart: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}

// para borrar del carrito el producto seleccionado
export const deleteCart = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const cart = await CartModel.findOne({ _id: cid });

    cart.products = cart.products.filter((product) => product.productId.toString() === pid);

    const result = await cart.save();
    res.send(result);
}

// para borrar todos los productos del carrito
export const deleteAll = async(req,res) =>{
    const cid = req.params.cid;

    await CartModel.deleteOne({ _id: cid });
    res.send({ status: 'success', message: 'Cart deleted successfully' });
}

