import express from 'express'

const app = express()
app.use(express.json()) //esto es para recibir un formato de tipo json en el body

const users = []

app.get('/api/user', (req, res) => {
    res.json(users)
})

app.post('/api/user', (req, res) => {
    const user = req.body

    users.push(user) //esto agarra el OBJETO creado user y lo mete en el ARRAY users

    res.status(201).json({ status: 'success!', message: 'creado' })
})

app.put('/api/user/:id', (req, res) => {
    const { id } = req.params

    res.send(`el id modificada es ${id}`)
})

app.listen(8080)