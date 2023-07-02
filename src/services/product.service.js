import FileManager from "./file.service.js";

export default class ProductManager extends FileManager {
    constructor() {
        super('./products.json')
    }
    create = async (data) => {
        const result = await this.set(data)
        return result
    }
    list = async (limit) => {
        const result = await this.get();
        if (limit) {
            return result.slice(0, limit);
        }
        console.log(result);
        return result;
    }
    update = async (id, data) => {
        const product = await this.getById(id);
        if (!product) {
            console.log(product);
            throw new Error('Producto no encontrado');
        }
        const updatedProduct = { ...product, ...data };
        await this.update(updatedProduct);
        // console.log(updatedProduct);
        return updatedProduct;
    }
}
