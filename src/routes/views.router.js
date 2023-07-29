// esta vista tendrá solo renderización

import { Router } from 'express';
import ProductManager from '../DAO/fileManager/file.service.js';

const router = Router()
const productManager = new ProductManager()

router.get('/', (req, res) => {
    res.render('index', {})
})

router.get('/products', async (req, res) => {
    const products = await productManager.list()
    res.render('products', { products })
})
router.get('/products-realtime', async (req, res) => {
    const products = await productManager.list()
    res.render('products_realtime', { products, title:'products real time' })
})

router.get('/form-products', async (req, res) => {
    res.render('form', {})
})

router.post('/form-products', async (req, res) => {
    const data = req.body
    const result = await productManager.create(data)
    console.log('result:', result);
    res.redirect('/products')
})

export default router