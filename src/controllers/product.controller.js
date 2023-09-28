import ProductModel from '../DAO/mongoManager/models/product.model.js'
import { createService, deleteOneService, findByIdService, limitService, updateOneService } from '../services/product.service.js';

// obtener todos los productos con un limit
export const limit = async (req, res) => {
    const limit = parseInt(req.query.limit) || undefined;
    try {
        const result = await limitService(limit)
        res.send(result);
    } catch (error) {
        console.log(error);
    }
}

// obtener un producto por su id router.get
export const findById = async (req, res) => {
    const productId = req.params.id;
    try {
        const result = await findByIdService(productId)
        res.send(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'internal error'
        res.status(status).json({ error: message });
    }
}

// crear un nuevo producto
export const create = async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    try {
        const result = await createService(title, description, code, price, status, stock, category, thumbnails);
        res.send(result);
    } catch (error) {
        console.log('Error: no se pudo crear');
    }
}

// actualizar un producto existente por su id router.put
export const updateOne = async (req, res) => {
    const productId = req.params.pid;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    try {
        // updateOne para actualizar el producto por su id
        const updatedProduct = await updateOneService(productId, title, description, code, price, status, stock, category, thumbnails)
        if (updatedProduct) {
            res.send('Producto actualizado correctamente');
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
}

// eliminar un producto por su id router.delete
export const deleteOne = async (req, res) => {
    const productId = req.params.pid;

    try {
        // deleteOne para borrar el producto por su id
        const deletedProduct = await deleteOneService(productId)
        if (deletedProduct.deletedCount > 0) {
            res.send('Producto eliminado correctamente');
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
}
