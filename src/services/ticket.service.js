import ticketsModel from "../DAO/mongoManager/models/ticket.model.js";
import ProductModel from "../DAO/mongoManager/models/product.model.js";

export const getTickets = async () => {
    try {
        const tickets = await ticketsModel.find();
        return tickets;
    } catch (error) {
        return { message: "Ocurrio un error: " + error.message }
    }
}

export const getTicketsByIdService = async (id) => {
    try {
        const ticket = await ticketsModel.findById(id);
        console.log(ticket);
        return { success: true, content: ticket, message: "El ticket existe" };
    } catch (error) {
        return { message: "Ocurrio un error: " + error.message }
    }
}

export const createTicketsService = async (ticket) => {
    const tickets = await getTickets();
    const codeOne = tickets.length
    const nextCode = codeOne ? codeOne + 1 : 1
    const purchase_datetime = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
    try {
        const newTickets = await ticketsModel({ ...ticket, code: nextCode, purchase_datetime: purchase_datetime });
        newTickets.save();
        console.log(newTickets);
        return { success: true, message: "Ticket creado con exito" }
    } catch (error) {
        return { success: false, message: "Ocurrio un error: " + error.message }
    }
}