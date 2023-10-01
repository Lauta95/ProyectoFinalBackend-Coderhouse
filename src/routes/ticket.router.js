import { Router } from "express";
import { createTickets } from "../controllers/ticket.controller.js"

const router = Router();

router.post("/:cid/purchase", createTickets)

export default router;