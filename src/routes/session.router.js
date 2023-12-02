import { Router } from "express";
import UserModel from "../DAO/mongoManager/models/user.model.js";
import { createHash, isValidPassword, generateToken, generateTokenMail } from "../utils.js";
import passport from "passport";
import Mail from "../modules/mail.js";
import jwt from "jsonwebtoken"
import CustomError from "../services/errors/custom_error.js";
import upload from '../middlewares/multer.js'

const router = Router()
router.get('/api/session/login-github', (req, res) => {
    res.render('home', {})
})
router.get('/login', (req, res) => { res.render('login', {}) })
router.get('/register', (req, res) => { res.render('register', {}) })

router.post('/login', passport.authenticate('login', '/login'), async (req, res) => {
    if (!req.user) return res.status(400).send('invalid credentials')
    const { password: _, ...passwordHidden } = req.user.toObject()
    req.session.user = req.user;
    const token = generateToken(passwordHidden)
    res.cookie('auth', token)
    await UserModel.findByIdAndUpdate(req.user._id, {
        last_connection: new Date().toLocaleString()
    })
    console.log("COMMENT: ", req.user);

    return res.redirect('/profile')
})

router.post('/logout', passport.authenticate('jwt', { session: false }), async (req, res) => {

    res.cookie('auth', '')
    await UserModel.findByIdAndUpdate(req.user._id, {
        last_connection: new Date().toLocaleString()
    })
    res.redirect('/')
})

// si se desea subir un documento, el link va a redirigir al siguiente endpoint:
router.post('/documents', passport.authenticate('jwt', { session: false }), upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ status: 'error', error: 'no file' })
    }
    console.log(req.file);
    await UserModel.findByIdAndUpdate(req.user._id, {
        documents: [{
            name: req.file.originalname,
            reference: req.file.path
        }]
    })
    res.send('file uploaded')
});

router.get(
    "/premium/:uid",
    passport.authenticate("jwt", { session: false }), async (req, res) => {
        try {
            const id = req.params.uid;
            const user = await UserModel.findByIdAndUpdate(id);
            if (user) {
                if (user.role === "admin") {
                    console.error(error);
                }
                if (user.role === "usuario") {
                    user.role = "premium";
                    await UserModel.findByIdAndUpdate(user._id, user);
                    return res.render("profile", user);
                }
                user.role = "usuario";
                await UserModel.findByIdAndUpdate(user._id, user);
                return res.render("profile", user);
            } else {
                console.error(error);
            }
        } catch (error) {
            console.log("Error al cambiar a usuario premium");
            res.status(500).json({ error: error.message });
        }
    });


// si se desea subir una imagen de perfil, el link va a redirigir al siguiente endpoint:
router.post('/profile', passport.authenticate('jwt', { session: false }), upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ status: 'error', error: 'no file' })
    }
    console.log(req.file);
    await UserModel.findByIdAndUpdate(req.user._id, {
        documents: [{
            name: req.file.originalname,
            reference: req.file.path
        }]
    })
    res.send('file uploaded')
});

// si se desea subir una imagen de producto, el link va a redirigir al siguiente endpoint:
router.post('/products', passport.authenticate('jwt', { session: false }), upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ status: 'error', error: 'no file' })
    }
    console.log(req.file);
    await UserModel.findByIdAndUpdate(req.user._id, {
        documents: [{
            name: req.file.originalname,
            reference: req.file.path
        }]
    })
    res.send('file uploaded')
});

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

router.post('/recover', async (req, res) => {
    const email = req.body;
    const token = generateTokenMail(email)
    const mailer = new Mail

    await mailer.send(email, 'restablecer contraseña', `<a href="http://127.0.0.1:8080/api/session/reset/${token}">recuperar contraseña</a>`)

    res.send('mail enviado!')


})
router.post('/reset/:token', async (req, res) => {
    try {
        const { token } = req.params
        const { password } = req.body

        const user = await jwt.verify(token, 'secretForJWT')

        console.log(user, 'USEREMAIL:::');
        const email = user.mail.email
        const userFound = await UserModel.findOne({ email })
        console.log(userFound);
        const passwordIsMatch = await isValidPassword(userFound, password)
        console.log('VERPASS:::>', passwordIsMatch, password);
        if (passwordIsMatch) {
            // CustomError({
            //     name: 'las contraseñas deben ser diferentes',
            //     cause: 'se repite contraseña',
            //     message: 'asd',
            //     code: 400
            // })

            console.log('error');
        }
        const passwordHashed = await createHash(password)
        console.log(passwordHashed);
        console.log(userFound.password);
        const userUpdated = await UserModel.updateOne({ email }, { password: passwordHashed })
        console.log(userUpdated);
        res.send('contraseña actualizada')
    } catch (error) {
        console.log(error);
        res.send(error)
    }


})

export default router