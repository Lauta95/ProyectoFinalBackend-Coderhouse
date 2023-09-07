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
        console.log('callback: ', token)
        // setear el jwt como una cookie:
        res.cookie('keyCookieForJWT', token).redirect('/')
        console.log('JWT TOKEN: ', token);
    }
)
// Ruta para obtener el usuario actual
router.get('/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    } else {
        res.status(401).json({ message: 'No estás autenticado' });
    }
});
export default router