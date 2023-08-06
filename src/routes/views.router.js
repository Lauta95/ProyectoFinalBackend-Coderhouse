// esta vista tendrá solo renderización
import { Router } from 'express';
import ProductManager from '../DAO/fileManager/product.service.js';
import ProductModel from '../DAO/mongoManager/models/product.model.js'

const router = Router()
const productManager = new ProductManager()

router.get('/', (req, res) => {
    res.render('index', {})
})

router.get('/list', async (req, res) => {

    const page = parseInt(req.query?.page || 1)
    const limit = parseInt(req.query?.limit || 5)
    const queryParams = req.query?.query || ''
    const query = {}
    if (queryParams) {
        const field = queryParams.split(',')[0]
        let value = queryParams.split(',')[1]

        if (!isNaN(parseInt(value))) value = parseInt(value)

        query[field] = value
    }
    const sortField = req.query?.sort?.split(':')[0];
    const sortOrder = req.query?.sort?.split(':')[1];
    const result = await ProductModel.paginate(query, {
        page,
        limit,
        lean: true,
        sort: { [sortField]: sortOrder === 'desc' ? -1 : 1 }
    })
    res.render('productsList', result)
})

router.get('/products', async (req, res) => {
    const products = await productManager.list()
    res.render('products', { products })
})
router.get('/products-realtime', async (req, res) => {
    const products = await productManager.list()
    res.render('products_realtime', { products, title: 'products real time' })
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