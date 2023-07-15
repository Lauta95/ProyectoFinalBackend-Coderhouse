import express from 'express'
import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'
import viewsRouter from './routes/views.router.js'
import handlebars from 'express-handlebars'
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
app.listen(8080)