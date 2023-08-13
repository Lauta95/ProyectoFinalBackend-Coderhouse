import express from 'express'
import session from 'express-session'

const app = express()

app.use(session({
    secret: 'paraFirmarElIdEnElBrowser',
    resave: true,//para mantener la session activa
    saveUninitialized: true //guardar algo aunque este vacío
}))

app.get('/', (req, res) => res.send('ok'))

app.get('/session', (req, res) => {
    console.log(req.session);

    if (req.session.contador) {
        req.session.contador++
        return res.send(`se ha visitado el sitio ${req.session.contador} veces`)
    }

    req.session.contador = 1
    res.send('welcome!')
})

app.listen(8080)