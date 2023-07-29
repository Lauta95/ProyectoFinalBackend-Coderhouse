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
    addProduct = async (cid, pid) => {
        const cart = await this.getById(cid);
        const productIndex = cart.products.findIndex((product) => product.pid === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1
        } else {
            cart.products.push({ pid: pid, quantity: 1 })
        }
        return await this.update(cart, cid)
    }
    list = async () => {
        return await this.get()
    }
}