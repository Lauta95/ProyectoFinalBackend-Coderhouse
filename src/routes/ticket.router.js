import { Router } from "express";
import { createTickets, getTicketById } from "../controllers/ticket.controller.js"

const router = Router();

router.post("/:cid/purchase", createTickets)
router.get("/:cid/ticket", getTicketById)

export default router;