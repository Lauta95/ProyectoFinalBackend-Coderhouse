import { deleteAllService, deleteCartService, findOneBodyService, findOneService, findService, pidBodyService, productDetailsService, addToCartService, createService, purchaseCartService } from "../services/cart.service.js"



export const find = async (req, res) => {
    const result = await findService()
    res.send(result)
}

export const findOne = async (req, res) => {
    const cid = req.params.cid;
    // se agrega populate() para cargar los datos completos de los productos relacionados
    const cart = await findOneService(cid)
    res.send(cart);
}

export const create = async (req, res) => {
    const result = await createService()
    res.send(result)
}

// Nuevos endpoints de la segunda preentrega:

// para actualizar el carrito por id
export const findOneBody = async (req, res) => {
    const cid = req.params.cid;
    const { products } = req.body;
    const cart = await findOneBodyService(cid, products)
    res.send(cart);
}

// para poder actualizar solamente la cantidad de ejemplares del producto por cualquier cantidad pasada desde el req.body:
export const pidBody = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const { quantity } = req.body;

    const cart = await pidBodyService(cid, pid, quantity);
    res.send(cart);
}

// POST PARA AGREGAR AL CARRITO CON EL BOTÓN DIRECTAMENTE Y ENTRANDO AL DETALLE DEL PRODUCTO (PRODUCTDETAILS.HANDLEBARS)
export const productDetails = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const cart = await productDetailsService(cid, pid, quantity);
        console.log(cart);
        // para ir al carrito una vez agregado:
        const updatedCart = await productDetailsService(cid)
        res.render('cartDetails', { cart: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}

// para borrar del carrito el producto seleccionado
export const deleteCart = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cart = await deleteCartService(cid, pid)
    res.send(cart);
}

// para borrar todos los productos del carrito
export const deleteAll = async (req, res) => {
    const cid = req.params.cid;
    await deleteAllService(cid);
    res.send({ status: 'success', message: 'Cart deleted successfully' });
}

export const addToCart = async (req, res) => {
    const { cid } = req.params
    const { productId, quantity } = req.body;

    try {
        const result = await addToCartService(cid, productId, quantity);
        res.send(result);
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
};

export const purchaseCart = async (req, res) => {
    const user = req.user
    console.log(req.user);

    const { cid } = req.params
    try {

        const result = await purchaseCartService(user, cid);

        if (result.success) {
            return res.status(201).send({ success: true, message: "Ticket creado con éxito" });
        } else {
            return res.status(500).send({ success: false, message: result.message });
        }
    } catch (error) {
        return res.status(500).send({ success: false, message: "Ocurrió un error interno: ", error});
    }
}