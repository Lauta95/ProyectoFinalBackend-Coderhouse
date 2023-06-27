import express from 'express'
import { Router } from 'express'
import ProductManager from '../services/product.service.js';
const productManager = new ProductManager();
const app = express()

const router = Router()

app.get('/products', async (req, res) => {
    const limit = req.query.limit;
    try {
        const products = await productManager.getProducts();
        if (!limit) {
            res.json(products);
        } else {
            const limiteDeProductos = products.slice(0, limit);
            res.json(limiteDeProductos);
        }
    }
    catch (err) {
        res.json(err);
    }
});
app.get('/products/:pid', async (req, res) => {
    let pid = req.params.pid;
    try {
        console.log(req.params);
        const product = await productManager.getProductById(Number(pid));
        if (!product) return res.status(404).send("404: Product not found")
        res.json(product);
    }
    catch (err) {
        res.json(err);
        console.log(err);
        return res.status(err.status || 500).json({ error: err.message });
    }
});

export default router