import { getTicketsByIdService } from "../services/ticket.service.js";



export const getTicketById = async (req, res) => {
    const cid = req.params.cid;
    const result = await getTicketsByIdService(cid);
    return res.send(result)
} 