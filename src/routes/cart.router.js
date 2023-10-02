import { Router } from "express";
import { find, findOne, create, findOneBody, pidBody, productDetails, deleteCart, deleteAll, addToCart } from "../controllers/cart.controller.js"

const router = Router()

router.get('/', find)
router.get('/:cid', findOne)
router.post('/', create)
router.put('/:cid', findOneBody)
router.put(':cid/products/pid', pidBody)
router.post(':cid/products:pid', productDetails)
router.delete('/:cid/products/:pid', deleteCart)
router.delete('/:cid', deleteAll)
router.post('/:cid/add', addToCart)

export default router