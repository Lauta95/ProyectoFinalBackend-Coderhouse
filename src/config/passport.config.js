import passport from 'passport'; //para manejar los diferentes medios para iniciar sesión
import local from 'passport-local'; //para iniciar sesion de manera local
import UserModel from '../DAO/mongoManager/models/user.model.js';
import { createHash, extractCookie, isValidPassword, generateToken } from '../utils.js';
import passportGoogle from 'passport-google-oauth20'
import GitHubStrategy from 'passport-github2'
import passportJWT from 'passport-jwt'
import CartModel from '../DAO/mongoManager/models/cart.model.js';
import { generateUserErrorInfo } from '../services/errors/info.js';
import CustomError from '../services/errors/custom_error.js';
import EErrors from '../services/errors/enums.js';


// GH->
// App ID: 375160
// Client ID: Iv1.270c5a68790735e4
// secret: 9d675ea5525ade24d354e66a9866417d85fb9991

const LocalStrategy = local.Strategy
const GoogleStrategy = passportGoogle.Strategy;
const JWTstrategy = passportJWT.Strategy;
const JWTextract = passportJWT.ExtractJwt;

const GOOGLE_CLIENT_ID = '719876990121-rp7993d5rjb2c8p52oeaavpa2sungap3.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'

const initializePassport = () => {

    // los LocalStrategy funcionan como un middleware

    // para autorizar, extraer y validar el jwt:
    passport.use('jwt', new JWTstrategy(
        {
            // Esto lo va a hacer la estrategia del jwt por dentro=>
            // extraer:
            jwtFromRequest: JWTextract.fromExtractors([extractCookie]),
            // además va a desencriptar, por lo tanto hay que pasarle la key:
            secretOrKey: 'secretForJWT'
        },
        (jwt_payload, done) => {
            if (jwt_payload) {
                // console.log('jwt TOKEN PAYLOAD: ', { jwt_payload });
                return done(null, jwt_payload);
            } else {
                console.error('jwt token not found');
                return done(null, false);
            }
            // console.log({ jwt_payload });
            // return done(null, jwt_payload)
        }
    ))

    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:8080/callback-google"
    },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile);
            const email = profile.emails[0].value

            const user = await UserModel.findOne({ email })
            if (user) {
                console.log('already exists');
                return done(null, user)
            }

            const result = await UserModel.create({ email, name: '', password: '' });

            return done(null, result)
        }
    ));

    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.270c5a68790735e4',
            clientSecret: '9d675ea5525ade24d354e66a9866417d85fb9991',
            callbackURL: 'http://127.0.0.1:8080/api/session/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await UserModel.findOne({ email: profile._json.email })
                if (user) {
                    console.log('user already exists ' + profile._json.email);
                    let token = generateToken(user)
                    console.log('token: ', token);
                    user.token = token
                    return done(null, user)
                } else {
                    const newUser = {
                        name: profile._json.name,
                        email: profile._json.email,
                        password: '',
                        social: 'github',
                        role: 'usuario'
                    }
                    const result = await UserModel.create(newUser)
                    console.log(result);
                    let token = generateToken(result)
                    console.log('token: ', token);
                    result.token = token
                    return done(null, result)
                }

            } catch (e) {
                return done('error to login with github' + e)
            }
        }
    ))

    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true, // que se pueda acceder al objeto request como cualquier otro middleware
            usernameField: 'email'
        },
        // logica para iniciar sesion desde local, tiene cuatro parámetros: request username password done
        async (req, username, password, done) => {
            const { first_name, last_name, age, email } = req.body
            try {
                const user = await UserModel.findOne({ email: username })
                if (user) {
                    CustomError.createError({
                        name: 'user creation error',
                        cause: generateUserErrorInfo(user),
                        message: 'error al intentar crear usuario, usuario ya existe',
                        code: EErrors.DATABASES_ERROR
                    })

                    // console.log('user already exists');
                    // return done(null, false)
                }
                const cart = await CartModel.create({ products: [] })
                console.log(cart);
                const newUser = {
                    first_name,
                    last_name,
                    age,
                    email,
                    password: createHash(password),
                    cartId: cart._id
                }
                const result = await UserModel.create(newUser)

                return done(null, result)
            } catch (e) {
                return done('error to register ' + e)
            }
        }
    ))

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ email: username })
                // console.log(user);
                if (!user) {

                    console.error('user doesnt exists');
                    return done(null, false)
                }
                if (!isValidPassword(user, password)) {
                    console.error('password not valid');
                    return done(null, false)
                }
                return done(null, user)
            } catch (e) {
                return done('error login ' + e)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        console.log('serializeUser: ', user);
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })
}

export default initializePassport