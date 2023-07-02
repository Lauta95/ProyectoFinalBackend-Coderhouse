export default class ErrorObject extends Error {
    constructor(message, status){
        super(message)
        this.status = status
    }
}