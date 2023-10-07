import { Router } from "express";
import { limit, findById, create, updateOne, deleteOne } from "../controllers/product.controller.js"
import { isAdmin } from "../middlewares/isadmin.js";
import passport from "passport";

const router = Router()

router.get('/', limit)
router.get('/:id', findById)
router.post('/', passport.authenticate('jwt', { session: false }), isAdmin, create)
router.put('/:pid', updateOne)
router.delete('/:pid', deleteOne)

export default router