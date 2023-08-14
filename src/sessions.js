import express from 'express'
import session from 'express-session'
import FileStore from 'session-file-store'

const app = express()
const fileStore = FileStore(session)

app.use(session({
    store: new fileStore({
        path: './sessions',
        ttl: 100,
        rettries: 2
    }),
    secret: 'secret',
    resave: true,//para mantener la session activa
    saveUninitialized: true //guardar algo aunque este vacío
}))

app.get('/', (req, res) => res.send('ok'))

app.get('/login', (req, res) => {
    if (req.session.user) return res.send('already logged')

    const { username } = req.query
    if (!username) return res.send('need a username')

    req.session.user = username
    return res.send('login success')
})

function auth(req, res, next){
    return req.session?.user ? next() : res.status(401).send('auth error')
}
app.get('/private', auth, (req, res) => { res.send(`private page ${req.session.user}`) })

app.listen(8080)










// -------------------------------------------------------------------------------------------
// app.get('/', (req, res) => {
//     const name = req.session.name || req.query.name
//     console.log(req.session);
//     if(req.session.counter){
//         req.session.counter++
//         return res.send(`visitaste la Página ${name} ${req.session.counter}`)
//     }
//     req.session.name = name

//     req.session.counter = 1


//     res.send(`te damos la Bienvenida ${name} ${req.session.counter}`)
// })

// app.get('/session', (req, res) => {
//     console.log(req.session);

//     if (req.session.contador) {
//         req.session.contador++
//         return res.send(`se ha visitado el sitio ${req.session.contador} veces  `)
//     }

//     req.session.contador = 1
//     res.send('welcome!')
// })

// app.get('/logout', (req, res) => {
//     req.session.destroy(err => {
//         if (err) return res.send('logout error')

//         return res.send('logout OK')
//     })
// })

// const DB = [
//     {
//         username: 'lautaro',
//         password: 'secret',
//         rol: 'admin'
//     }
// ]

// app.get('/login', (req, res) => {
//     const { username, password } = req.query

//     const user = DB.find(u => u.username === username && u.password === password)
//     if (!user) return res.send('invalid credentials')

//     req.session.user = user

//     res.send('login success')
// })

// // req.session?.user checks if the req.session object exists, and if it does, it checks if the user property exists within the req.session object. If either req.session or req.session.user is null or undefined, the expression will evaluate to undefined without throwing an error. If both req.session and req.session.user exist, the expression will evaluate to the value of req.session.user.
// function authentication(req, res, next) {
//     if(req.session?.user) return next()

//     return res.status(401).send('error de autenticación')
// }

// app.get('/private', authentication, (req, res) => {
//     res.send('esta pagina la puede ver la persona logueada ' + JSON.stringify(req.session.user))
// })

// app.listen(8080)