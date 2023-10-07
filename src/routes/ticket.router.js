import { Router } from "express";
import { getTicketById } from "../controllers/ticket.controller.js"

const router = Router();

router.get("/:cid", getTicketById)

export default router;