import FileManager from "./file.service.js";

export default class CartManager extends FileManager {
    constructor() {
        super('./carts.json')
    }
    create = async () => {
        const data = {
            products: []
        }
        return await this.set(data)
    }

    addProduct = async(cid, pid) =>{
        const cart = await this.getById(cid)
        cart.products.push(pid)

        return await this.updateCart(cart)
    }

    list = async () => {
        return await this.get()
    }
}