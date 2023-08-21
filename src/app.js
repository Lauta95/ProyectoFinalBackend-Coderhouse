import express from 'express'
import productRouter from './routes/product.router.js'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import cartRouter from './routes/cart.router.js'
import chatRouter from './routes/chat.router.js'
import ChatModel from './DAO/mongoManager/models/message.model.js'
import viewsRouter from './routes/views.router.js'
import handlebars from 'express-handlebars'
import ProductManager from './DAO/fileManager/product.service.js'
import sessionRouter from './routes/session.router.js'
import MongoStore from 'connect-mongo'
import session from 'express-session'
import passport from 'passport'
import __dirname from './utils.js'
import initializePassport from './config/passport.config.js'

const app = express()
const URL = "mongodb+srv://freecodecamp-user:fDlfjlzTXxxBhYva@cluster0.vw59urg.mongodb.net/?retryWrites=true&w=majority"
const dbName = 'sessions_backend'
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// handlebars
app.engine('handlebars', handlebars.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}))
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')



app.use('/static', express.static(__dirname + '/public'))
// ->express session(middleware de sesión en una aplicación express, para administrar y mantener la información de sesión de los usuarios) 
// ->mongoStore(administrar y almacenar las sesiones en una base de datos mongoDB)
app.use(session({
    store: MongoStore.create({
        mongoUrl: URL,
        dbName,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 1000
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use('/', viewsRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/chat', chatRouter)
app.use('/api/session', sessionRouter)

const runServer = () => {
    const httpServer = app.listen(8080, () => console.log('listening...'))
    const io = new Server(httpServer)
    const messages = [];
    io.on('connection', socket => {
        socket.on('new-product', async data => {
            const productManager = new ProductManager()
            await productManager.create(data)

            const products = await productManager.list()
            io.emit('reload-table', products)
        })

        socket.on('new', user => console.log(`${user} se acaba de conectar`))

        socket.on('message', data => {
            messages.push(data)
            io.emit('logs', messages)
        })
        socket.on('client:message', async data => {
            console.log('Data received from client:', data);
            messages.push(data);
            try {
                const savedMessage = await ChatModel.create(data);
                console.log('Message saved:', savedMessage);
            } catch (error) {
                console.error('Error saving message:', error);
            }
            console.log('Current messages:', messages);
            io.emit('server:messages', messages);
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
    .catch(e => console.log("can't connect to db chat"))

mongoose.connection.on('error', (error) => {
    console.error('Error connecting to MongoDB:', error.message);
});

