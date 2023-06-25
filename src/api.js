import express from 'express'

const app = express()
app.use(express.json()) //esto es para recibir un formato de tipo json en el body

let users = []

app.get('/api/user', (req, res) => {
    res.json(users)
})

app.post('/api/user', (req, res) => {
    const user = req.body

    users.push(user) //esto agarra el OBJETO creado user y lo mete en el ARRAY users

    res.status(201).json({ status: 'success!', message: 'creado' })
})

app.put('/api/user/:id', (req, res) => {
    const id = parseInt(req.params.id) //al ser estrictamente igual, los params vienen por string, hay que convertir el req.params a entero
    const user = req.body

    const userUbicado = users.findIndex(u => u.id === id) //u representa cada uno de los usuarios. u es el id buscado

    if (userUbicado < 0) {
        return res.status(404).json({ status: 'error', message: 'user not found' })
    }

    users[userUbicado] = user

    res.json({ status: 'success', message: 'actualizado' })
})

app.delete('/api/user/:id', (req, res) => {
    const id = parseInt(req.params.id)

    const userUbicado = users.findIndex(u => u.id === id) //u representa cada uno de los usuarios. u es el id buscado

    if (userUbicado < 0) {
        return res.status(404).json({ status: 'error', message: 'user not found' })
    }

    users = users.filter(u => u.id !== id)
    console.log(users);
    res.send({ status: 'success', message: 'eliminado' })
})

app.listen(8080)