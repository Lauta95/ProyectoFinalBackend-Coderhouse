import { Router } from 'express'
import ProductModel from '../DAO/mongoManager/models/product.model.js'

const router = Router()
// obtener todos los productos con un limit
router.get('/', async (req, res) => {
    const limit = req.query.limit;
    const result = await productManager.list(limit)
    res.send(result)
})
// obtener un producto por su id router.get
router.get('/:id', async (req, res) => {
    const productId = req.params.id; // Obtener el ID del producto desde los parámetros de la URL

    try {
        const product = await productManager.getById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});
// crear un nuevo producto
router.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

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
    const result = await productManager.create(data)
    res.send(result)
})
// actualizar un producto existente por su id router.put
router.put('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    if (!(title && description && code && price && stock && category && thumbnails)) {
        return res.status(400).json({ error: '2faltan campos obligatorios' })
    }
    const updatedData = {
        title,
        description,
        code,
        price,
        status: status ?? true,
        stock,
        category,
        thumbnails
    }
    try {
        const updatedProduct = await productManager.updateProduct(updatedData, productId);
        res.send(updatedProduct);
    } catch (error) {
        const status = error.status || 400
        console.log(error.message);
        res.status(status).json(error.message);
    }
});
// eliminar un producto por su id router.delete
router.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;

    try {
        await productManager.deleteProduct(productId);
        res.send('Producto eliminado correctamente');
    } catch (error) {
        const status = error.status || 400;
        console.log(error.message);
        res.status(status).json(error.message);
    }
});
export default router