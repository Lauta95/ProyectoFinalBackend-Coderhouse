import { createTicketsService, getTicketsByIdService } from "../services/ticket.service.js";

export const createTickets = async (req, res) => {
    const { amount, purchaser } = req.body;

    if (!amount || !purchaser) {
        return res.status(400).send({ success: false, message: "Se requieren campos 'amount' y 'purchaser'." });
    }

    try {
        const ticket = {
            amount,
            purchaser
        };
        const result = await createTicketsService(ticket);

        if (result.success) {
            return res.status(201).send({ success: true, message: "Ticket creado con éxito" });
        } else {
            return res.status(500).send({ success: false, message: result.message });
        }
    } catch (error) {
        return res.status(500).send({ success: false, message: "Ocurrió un error interno: " + error.message });
    }
}

export const getTicketById = async (req, res) => {
    const cid = req.params.cid;
    const result = await getTicketsByIdService(cid);
    return res.send(result)
} 