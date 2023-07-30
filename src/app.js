import express from 'express'
import productRouter from './routes/product.router.js'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import cartRouter from './routes/cart.router.js'
import viewsRouter from './routes/views.router.js'
import handlebars from 'express-handlebars'
import ProductManager from './DAO/fileManager/product.service.js'
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

const URL = "mongodb+srv://freecodecamp-user:fDlfjlzTXxxBhYva@cluster0.vw59urg.mongodb.net/?retryWrites=true&w=majority"

const runServer = () => {
    const httpServer = app.listen(8080, () => console.log('listening...'))
    const io = new Server(httpServer)

    io.on('connection', socket => {
        socket.on('new-product', async data => {
            const productManager = new ProductManager()
            await productManager.create(data)

            const products = await productManager.list()
            io.emit('reload-table', products)
        })
    })
}

// mongoose.set('strictQuery', false)
console.log('connecting');
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'ecommerce',
})
    .then(() => {
        console.log('DB connected!');
        runServer()
    })
    .catch(e => console.log("can't connect to db"))

mongoose.connection.on('error', (error) => {
    console.error('Error connecting to MongoDB:', error.message);
});