import { Ticket } from "../services/ticket.service.js";

const TicketService = new Ticket()

export const createTicket = async (req, res) => {
    const ticket = {
        amount: req.body.amount,
        purchaser: req.body.purchaser
    }
    try {
        await TicketService.createTickets(ticket);
        res.status(200).send({ succes: true, message: "ticket creado con exito" })
    } catch (error) {
        res.status(404).send({ succes: false, message: error.message })
    }
}