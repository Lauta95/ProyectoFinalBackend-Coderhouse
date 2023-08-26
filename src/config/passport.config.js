import passport from 'passport'; //para manejar los diferentes medios para iniciar sesión
import local from 'passport-local'; //para iniciar sesion de manera local
import UserModel from '../DAO/mongoManager/models/user.model.js';
import { createHash, isValidPassword } from '../utils.js';
import passportGoogle from 'passport-google-oauth20'
import GitHubStrategy from 'passport-github2'

// GH->
// App ID: 375160
// Client ID: Iv1.270c5a68790735e4
// secret: 9d675ea5525ade24d354e66a9866417d85fb9991

const LocalStrategy = local.Strategy
const GoogleStrategy = passportGoogle.Strategy;

const GOOGLE_CLIENT_ID = '719876990121-rp7993d5rjb2c8p52oeaavpa2sungap3.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'

const initializePassport = () => {


    // los LocalStrategy funcionan como un middleware

    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:8080/api/session/callback-google"
      },
      async (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value
        UserModel.findOrCreate({ email }, (err, user) => {
          return done(err, user);
        });
      }
    ))

    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.270c5a68790735e4',
            clientSecret: '9d675ea5525ade24d354e66a9866417d85fb9991',
            callbackURL: 'http://127.0.0.1:8080/api/session/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await UserModel.findOne({ email: profile._json.email })
                if (user) {
                    console.log('user already exists ' + profile._json.email);
                    return done(null, user)
                }
                const newUser = {
                    name: profile._json.name,
                    email: profile._json.email,
                    password: ''
                }
                const result = await UserModel.create(newUser)
                return done(null, result)
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
                    console.log('user already exists');
                    return done(null, false)
                }
                const newUser = {
                    first_name,
                    last_name,
                    age,
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
                console.log(user);
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