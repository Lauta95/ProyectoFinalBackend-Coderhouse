import { Router } from 'express'
// import CartManager from '../DAO/fileManager/cart.service.js'
import CartModel from '../DAO/mongoManager/models/cart.model.js'
import ProductModel from '../DAO/mongoManager/models/product.model.js'

const router = Router()

router.get('/', async (req, res) => {
    const result = await CartModel.find()
    res.send(result)
})
router.get('/:cid', async (req, res) => {
    const cid = req.params.cid;
  
    // se agrega populate() para cargar los datos completos de los productos relacionados
    const cart = await CartModel.findOne({ _id: cid }).populate('products')
  
    res.send(cart);
    console.log(cart);
  });
router.post('/', async (req, res) => {
    const result = await CartModel.create({ products: [] })
    res.send(result)
})
router.post('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.query.quantity || 1

    const cart = await CartModel.findOne({ _id: cid })

    const existingProduct = cart.products.find(product => product.id === pid)
    if (existingProduct) {
        existingProduct.quantity += parseInt(quantity, 10)
    } else {
        cart.products.push({ id: pid, quantity })
    }

    const result = await cart.save()
    res.send(result);
});

// Nuevos endpoints de la segunda preentrega:

// para actualizar el carrito por id
router.put('/:cid', async (req, res) => {
    const cid = req.params.cid;
    const { products } = req.body;

    const cart = await CartModel.findOne({ _id: cid })
    cart.products = products;

    const result = await cart.save();
    res.send(result);
});

// para poder actualizar solamente la cantidad de ejemplares del producto por cualquier cantidad pasada desde el req.body:
router.put('/:cid/products/:pid', async (req, res) => {
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
});

// para borrar del carrito el producto seleccionado
router.delete('/:cid/products/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const cart = await CartModel.findOne({ _id: cid });

    cart.products = cart.products.filter((product) => product.id !== pid);

    const result = await cart.save();
    res.send(result);
});

// para borrar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    const cid = req.params.cid;

    await CartModel.deleteOne({ _id: cid });
    res.send({ status: 'success', message: 'Cart deleted successfully' });
});

export default router