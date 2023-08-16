import { Router } from "express";
import UserModel from "../DAO/mongoManager/models/user.model.js";

const router = Router()

router.post('/login', async (req, res) => {

    const { email, password } = req.body
    const user = await UserModel.findOne({ email, password })
    if (!user) {
        console.log('hi');
        return res.render('login', { error: 'Invalid credentials' });

    }
    req.session.user = user
    return res.redirect('/profile')
})

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const user = {
            first_name,
            last_name,
            email,
            age,
            password
        };
        await UserModel.create(user)
        console.log(user);
        return res.redirect('/')
    } catch (error) {
        console.error('Error creating user:', error);
        return res.render('register', { error: 'User creation failed' });
    }
})

export default router