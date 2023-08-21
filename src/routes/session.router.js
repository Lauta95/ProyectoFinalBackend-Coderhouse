import { Router } from "express";
import UserModel from "../DAO/mongoManager/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router()

router.get('/login', (req, res) => { res.render('login', {}) })
router.get('/register', (req, res) => { res.render('register', {}) })

router.post('/login', passport.authenticate('login', '/'), async (req, res) => {
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

router.get('/profile', auth, (req, res) => {
    const user = req.session.user

    res.render('profile', user)
})

export default router