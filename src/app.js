import express from 'express'
import productRouter from './routes/product.router.js'
import { Server } from 'socket.io'
import cartRouter from './routes/cart.router.js'
import viewsRouter from './routes/views.router.js'
import handlebars from 'express-handlebars'
import ProductManager from './services/product.service.js'
import __dirname from './utils.js'
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use('/static', express.static(__dirname + '/public'))

app.use('/', viewsRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

const httpServer = app.listen(8080)
const io = new Server(httpServer)

io.on('connection', socket => {
    socket.on('new-product', async data => {
        const productManager = new ProductManager()
        await productManager.create(data)

        const products = await productManager.list()
        io.emit('reload-table', products)
    })
})