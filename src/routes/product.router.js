import { Router } from 'express'
import ProductManager from '../services/product.service.js'

const router = Router()
const productManager = new ProductManager()
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
    const updatedData = req.body;
    
    console.log(updatedData);
    try {
        const updatedProduct = await productManager.update(productId, updatedData);
        res.send(updatedProduct);
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// eliminar un producto por su id router.delete

export default router