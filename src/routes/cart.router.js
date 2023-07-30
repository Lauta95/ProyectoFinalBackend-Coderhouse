import { Router } from 'express'
// import CartManager from '../DAO/fileManager/cart.service.js'
import CartModel from '../DAO/mongoManager/models/cart.model.js'

const router = Router()

router.get('/', async (req, res) => {
    const result = await CartModel.find()
    res.send(result)
})
router.get('/:cid/', async (req, res) => {
    const cid = req.params.cid
    const result = await CartModel.getById(cid)
    res.send(result)
})
router.post('/', async (req, res) => {
    const result = await CartModel.create({products: []})
    res.send(result)
})
router.post('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.query.quantity || 1

    const cart = await CartModel.findById(cid)
    cart.products.push({ id: pid, quantity })
    const result = cart.save()
    res.send(result);
});
export default router