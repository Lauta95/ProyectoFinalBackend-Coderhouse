import { Router } from 'express'
import CartManager from '../services/cart.service.js'

const router = Router()
const cartManager = new CartManager()

router.get('/', async(req,res)=>{
    const result = await cartManager.list()
    res.send(result)
})
router.get('/:cid/', async(req,res)=>{
    const cid = parseInt(req.params.cid)
    const result = await cartManager.getById(cid)
    res.send(result)
})
router.post('/', async(req,res)=>{
    const result = await cartManager.create()
    res.send(result)
})
router.post('/:cid/product/:pid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
  
    const result = await cartManager.addProduct(cid, pid);
    res.send(result);
  });
export default router