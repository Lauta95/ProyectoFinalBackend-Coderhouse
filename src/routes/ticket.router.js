import { Router } from "express";
import { createTickets } from "../controllers/ticket.controller.js"

const router = Router();

router.post("/", createTickets)

export default router;