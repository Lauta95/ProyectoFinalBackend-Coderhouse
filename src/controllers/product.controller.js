import ProductModel from '../DAO/mongoManager/models/product.model.js'

// obtener todos los productos con un limit
export const limit = async (req, res) => {
    const limit = parseInt(req.query.limit) || undefined;
    const result = await ProductModel.find().limit(limit);
    res.send(result);
}

// obtener un producto por su id router.get
export const findById = async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await ProductModel.findById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
}

// crear un nuevo producto
export const create = async (req, res) => {
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
    const result = await ProductModel.create(data)
    res.send(result)
}

// actualizar un producto existente por su id router.put
export const updateOne = async (req, res) => {
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
        // updateOne para actualizar el producto por su id
        const updatedProduct = await ProductModel.updateOne({ _id: productId }, updatedData);
        if (updatedProduct.nModified > 0) {
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
        const deletedProduct = await ProductModel.deleteOne({ _id: productId });
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
