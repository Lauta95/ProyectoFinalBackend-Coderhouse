// esta vista tendrá solo renderización
import { Router } from 'express';
import ProductManager from '../DAO/fileManager/product.service.js';
import ProductModel from '../DAO/mongoManager/models/product.model.js'
import CartModel from '../DAO/mongoManager/models/cart.model.js';

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

    // calcular el totla de cosas en la coleccion
    const totalDocs = await ProductModel.countDocuments(query);

    // calcular el total de paginas
    const totalPages = Math.ceil(totalDocs / limit);

    // calcular pagina anterior y siguiente
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    // ver si existen
    const hasPrevPage = prevPage !== null;
    const hasNextPage = nextPage !== null;

    const response = {
        status: 'success',
        payload: result.docs,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? `/list?limit=${limit}&page=${prevPage}` : null,
        nextLink: hasNextPage ? `/list?limit=${limit}&page=${nextPage}` : null,
    };

    // console.log para ver todo
    console.log(response);

    // renderizar 
    res.render('productsList', result)
})

// vista del /products para visualizar todos los productos con su respectiva paginación
router.get('/products', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const queryParams = req.query.query || '';
    const query = {};

    if (queryParams) {
        const field = queryParams.split(',')[0];
        let value = queryParams.split(',')[1];

        if (!isNaN(parseInt(value))) value = parseInt(value);

        query[field] = value;
    }

    const sortField = req.query.sort?.split(':')[0];
    const sortOrder = req.query.sort?.split(':')[1];

    // traer los productos con paginacion y el filtro
    const result = await ProductModel.paginate(query, {
        page,
        limit,
        lean: true,
        sort: { [sortField]: sortOrder === 'desc' ? -1 : 1 }
    });
    const carts = await CartModel.find()
    const cartId = carts ? carts[0]._id : null
    // renderizar todo
    res.render('products', {
        cartId,
        products: result.docs,
        totalPages: result.totalPages,
        currentPage: result.page,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage
    });
});

router.get('/products/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        // traer el detalle del producto por su id en POSTMAN:
        const product = await ProductModel.findById(productId);
        // renderizarlo:
        res.render('productDetails', product);

    } catch (error) {
        // mostrar error 500 en caso de no encontrarlo
        res.status(500).send('Internal Server Error');
    }
});


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