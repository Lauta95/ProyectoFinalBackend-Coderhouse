import passport from 'passport'; //para manejar los diferentes medios para iniciar sesión
import local from 'passport-local'; //para iniciar sesion de manera local
import UserModel from '../DAO/mongoManager/models/user.model.js';
import { createHash, isValidPassword } from '../utils.js';

const LocalStrategy = local.Strategy

const initializePassport = () => {
    // los LocalStrategy funcionan como un middleware
    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true, // que se pueda acceder al objeto request como cualquier otro middleware
            usernameField: 'email'
        },
        // logica para iniciar sesion desde local, tiene cuatro parámetros: request username password done
        async (req, username, password, done) => {
            const { name, email } = req.body
            try {
                const user = await UserModel.findOne({ email: username })
                if (user) {
                    console.log('user already exists');
                    return done(null, false)
                }
                const newUser = {
                    name,
                    email,
                    password: createHash(password)
                }
                const result = await UserModel.create(newUser)
                return done(null, result)
            } catch (e) {
                return done('error to register ' + error)
            }
        }
    ))

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ email: username }).lean().exec()
                if (!user) {
                    console.error('user doesnt exists');
                    return done(null, false)
                }
                if (!isValidPassword(user, password)) {
                    console.error('password not valid');
                    return done(null, false)
                }
            } catch (e) {
                return done('error login ' + error)
            }
        }
    ))
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) =>{
        const user = await UserModel.findById(id)
        done(null, user)
    })
}

export default initializePassport