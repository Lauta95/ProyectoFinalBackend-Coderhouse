import { Router } from 'express'
import ProductManager from '../services/product.service.js'

const router = Router()
const productManager = new ProductManager()

router.get('/', async(req,res)=>{
    const result = await productManager.list()
    res.send(result)
})
router.post('/', async(req,res)=>{
    const data = req.body
    const result = await productManager.create(data)
    res.send(result)
})

export default router