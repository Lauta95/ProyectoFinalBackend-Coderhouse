import express from 'express'

const app = express()

app.use(express.json())

const frase = 'Esto es un texto de prueba backend, usando get con postman'
app.get('/api/frase', (req, res) => {
    res.json({ frase })
})

app.get('/api/frase/:palabra', (req, res) => {
    const palabra = parseInt(req.params.palabra) - 1

    const lista = frase.split(' ')

    res.json({
        encontrada: lista[palabra]
    })


})

app.listen(8080)