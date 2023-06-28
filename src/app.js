import express from 'express'
import productsRouter from './routes/products.router.js'

const app = express()
app.use(express.json())

app.use('/api/users', productsRouter)
app.use('/health', (req, res) => {
    res.send('okkk')
})

app.listen(8080)