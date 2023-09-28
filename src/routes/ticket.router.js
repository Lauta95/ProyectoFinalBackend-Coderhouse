import { Router } from "express";
import { createTicket } from "../controllers/ticket.controller.js"

const router = Router();

router.post("/", createTicket)

export default router;