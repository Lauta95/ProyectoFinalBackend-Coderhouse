import { Router } from "express";
import UserModel from "../DAO/mongoManager/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

const router = Router()


router.get('/login', (req, res) => { res.render('login', {}) })
router.get('/register', (req, res) => { res.render('register', {}) })

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email })

    if (!user) {
        console.log('no se encontró el user');
        return res.redirect('/')
    }
    if(!isValidPassword(user, password)){
        console.log('password not valid');
        return res.redirect('/')
    }
    req.session.user = user
    return res.redirect('/profile')
})

router.post('/register', async (req, res) => {
    const data = req.body
    data.password = createHash(data.password) //hasheamos
    const result = await UserModel.create(data)
    console.log(result);
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

// ----nohash
// router.post('/login', async (req, res) => {

//     const { email, password } = req.body
//     const user = await UserModel.findOne({ email, password })
//     if (!user) {
//         console.log('hi');
//         return res.render('login', { error: 'Invalid credentials' });
//     }
//     if (user.email === 'adminCoder@gmail.com') {
//         user.role = 'admin';
//     } else {
//         user.role = 'user';
//     }

//     req.session.user = user
//     return res.redirect('/products')
// })

// router.post('/register', async (req, res) => {
//     try {
//         const { first_name, last_name, email, age, password } = req.body;
//         const user = {
//             first_name,
//             last_name,
//             email,
//             age,
//             password
//         };
//         await UserModel.create(user)
//         console.log(user);
//         return res.redirect('/')
//     } catch (error) {
//         console.error('Error creating user:', error);
//         return res.render('register', { error: 'User creation failed' });
//     }
// })



export default router