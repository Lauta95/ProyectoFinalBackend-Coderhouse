import { fileURLToPath } from 'url'
import { dirname } from 'path'
import jwt from 'jsonwebtoken'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
import bcrypt from 'bcrypt'
export default __dirname

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}


export const generateToken = user => {
    return jwt.sign({ user }, 'secretForJWT', { expiresIn: '24' })
}

export const extractCookie = req => {
    return (req && req.cookies) ? req.cookies['keyCookieForJWT'] : null
}