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
        return result;
    }
    updateProduct = async (data, id) => {
        let productExist = await this.getById(id)
        if(!productExist){
            throw new Error('id no encontrado')
        }
        await this.update(data, id);
        return 'ok';
    }
}
