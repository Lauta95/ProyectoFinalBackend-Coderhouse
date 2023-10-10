export const generateUserErrorInfo = user => {
    return `
    Uno o mas propiedades estan incompletos o no son validos.
        Lista de propiedades obligatorias:
            -first_name: Must be a string (${user?.first_name})
            -last_name: Must be a string (${user?.last_name})
            -email: Must be a string (${user?.email})
    `
}