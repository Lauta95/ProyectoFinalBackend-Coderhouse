import { Router } from "express";
import UserModel from "../DAO/mongoManager/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router()
router.get('/api/session/login-github', (req, res) => {
    res.render('home', {})
})
router.get('/login', (req, res) => { res.render('login', {}) })
router.get('/register', (req, res) => { res.render('register', {}) })

router.post('/login', passport.authenticate('login', '/login'), async (req, res) => {
    if (!req.user) return res.status(400).send('invalid credentials')

    req.session.user = req.user
    return res.redirect('/profile')
})

router.post(
    '/register',
    passport.authenticate('register', { failureRedirect: '/register' }),
    async (req, res) => {
        res.redirect('/')
    })

function auth(req, res, next) {
    if (req.session?.user) next()
    else res.redirect('/')
}

router.get('/profile',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        console.log(req.user);
        const { user } = req
        res.render('profile', user.user)
    })

router.get(
    '/login-github',
    passport.authenticate('github', { scope: ['user:email'] }),
    async (req, res) => { }
)

router.get(
    '/githubcallback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        if (!req.user) {
            res.status(401).send('auth failed :c')
        }
        const token = req.user.token;
        // setear el jwt como una cookie:
        res.cookie('keyCookieForJWT', token).redirect('/')
        console.log('JWT TOKEN: ', token);
    }
)
// Ruta para obtener el usuario actual
router.get('/current', (req, res) => {
    const token = req.headers['auth'];
    
    // debug para ver si se recibe el token
    console.log('Received token:', token);

    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        console.log(err);
        console.log(user);
        console.log(info);
        if (err) {
            console.error('Error during JWT authentication:', err);

            // return response con detalles para debug
            return res.status(500).json({ error: 'Internal Server Error', details: err });
        }

        // debug statement para checkear si el user object es recibido correctamente
        console.log('Authenticated User:', user);

        if (!user) {
            console.error('User not authenticated.');

            // return unauthorized
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // si esta todo bien se responde con el user en un objeto
        res.json({ user });
    })(req, res);
});

export default router