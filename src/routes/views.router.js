// esta vista tendrá solo renderización
import { Router } from 'express';
import ProductManager from '../DAO/fileManager/product.service.js';
import ProductModel from '../DAO/mongoManager/models/product.model.js'
import CartModel from '../DAO/mongoManager/models/cart.model.js';
import passport from 'passport'

const router = Router()
const productManager = new ProductManager()
// login
router.get('/', (req, res) => {
    // AGREGAR: MIDDLEWARE PARA QUE REDIRIJA AL PROFILE SI ES QUE HAY UNA SESION ACTIVA
    if (req.session?.user) {
        res.redirect('/products')
    }
    res.render('login', {})
})

router.post('/logout', (req, res) => {
    console.log('OK');

    req.session.destroy(() => {
        res.redirect('/')
    })
});

router.get('/register', (req, res) => {
    res.render('register', {})
})
// middleware para el profile: si existe la sesion, te manda al /profile con el middleware next()... si no te manda de nuevo al login
function auth(req, res, next) {
    if (req.session?.user) return next()
    res.redirect('/')
}
router.get('/profile', auth, (req, res) => {
    const user = req.session.user
    res.render('profile', user)
})

router.get(
    '/auth/google',
    passport.authenticate(
        'google',
        {
            scope: [
                'profile',
                'email'
            ]
        }
    ),
    (req, res) => { }
)

router.get(
    '/callback-google',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        console.log('CONECTADO CON GOOGLE!', req.user);
        req.session.user = req.user
        console.log(req.session);
        res.redirect('profile')
    })

// -------------------------------------------
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

    // req session del user para poder mostrar los datos del login en la ruta /products como por ejemplo en un mensaje de bienvenida
    const user = req.session.user;

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
    console.log(user)
    res.render('products', {
        cartId,
        // user para renderizar:
        carts,
        user,
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
// visualizar un carrito en específico, donde se van a listar solo los productos que pertenezcan a dicho carrito
router.get('/carts/:cid', async (req, res) => {
    const cid = req.params.cid;

    try {
        // Obtener el carrito por su ID y cargar los datos completos de los productos relacionados
        const cart = await CartModel.findOne({ _id: cid }).populate('products.productId');

        // Renderizar la vista del carrito específico y pasar los datos del carrito
        res.render('cartDetails', { cart });
    } catch (error) {
        // Mostrar error 500 en caso de no encontrar el carrito
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

router.get('/current', (req,res)=>{
    res.render('current', {})
})

// router.get('/profile', (req,res)=>{
//     res.render('profile', user.user)
// })

export default router