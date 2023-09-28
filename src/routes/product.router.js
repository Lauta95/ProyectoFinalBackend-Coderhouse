import { Router } from "express";
import { limit, findById, create, updateOne, deleteOne } from "../controllers/product.controller.js"

const router = Router()

router.get('/', limit)
router.get('/:id', findById)
router.post('/', create)
router.put('/:pid', updateOne)
router.delete('/:pid', deleteOne)

export default router