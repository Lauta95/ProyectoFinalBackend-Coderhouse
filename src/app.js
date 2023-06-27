import express from 'express'
import productsRouter from './routes/products.router.js'

const app = express()
app.use(express.json())

app.get('/', productsRouter)

app.listen(8080)