import ticketsModel from "../DAO/mongoManager/models/ticket.model.js";

class Ticket {
    constructor() {
    }

    getTickets = async () => {
        try {
            const tickets = await ticketsModel.find();
            return tickets;
        } catch (error) {
            return { message: "Ocurrio un error: " + error.message }
        }
    }

    getTicketsById = async (id) => {
        try {
            const ticket = await ticketsModel.findById(id);
            return { success: true, content: ticket, message: "Ticket creado con existo" };
        } catch (error) {
            return { message: "Ocurrio un error: " + error.message }
        }
    }

    createTickets = async (ticket) => {
        const tickets = await this.getTickets();
        const codeOne = tickets.length
        const nextCode = codeOne ? codeOne + 1 : 1
        const purchase_datetime = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
        try {
            const newTickets = await ticketsModel({ ...ticket, code: nextCode, purchase_datetime: purchase_datetime });
            newTickets.save();
            return { success: true, message: "Ticket creado con exito" }
        } catch (error) {
            return { success: false, message: "Ocurrio un error: " + error.message }
        }
    }
}

export default Ticket;