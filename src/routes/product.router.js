import { Router } from "express";
import { limit, findById, create, updateOne, deleteOne } from "../controllers/product.controller.js"
import { isAdmin } from "../middlewares/isadmin.js";
import passport from "passport";
import { generateProduct } from '../utils.js'

const router = Router()

router.get('/mockingproducts', async(req,res) => {
    const users = []

    for (let i = 0; i < 100; i++) {
        users.push(generateProduct())        
    }

    res.send({status: 'success', payload: users})
})
router.get('/', limit)
router.get('/:id', findById)
router.post('/', passport.authenticate('jwt', { session: false }), isAdmin, create)
router.put('/:pid', updateOne)
router.delete('/:pid', deleteOne)

export default router