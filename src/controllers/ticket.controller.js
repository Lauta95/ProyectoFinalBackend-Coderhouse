import { createTicketsService } from "../services/ticket.service.js";

export const createTickets = async (req, res) => {
    const ticket = {
        amount: req.body.amount,
        purchaser: req.body.purchaser
    }
    try {
        await createTicketsService(ticket);
        res.status(200).send({ succes: true, message: "ticket creado con exito" })
    } catch (error) {
        res.status(404).send({ succes: false, message: error.message })
    }
}