import { Router } from "express";
import { createTickets, getTicketById } from "../controllers/ticket.controller.js"

const router = Router();

router.get("/:cid", getTicketById)

export default router;