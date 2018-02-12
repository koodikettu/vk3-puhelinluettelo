const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

morgan.token('body', function(req, res) { return JSON.stringify(req.body)})
morgan.format('custom', ':method :url :body :res[content-length] - :response-time ms')

app.use(bodyParser.json())
app.use(cors())
app.use(morgan('custom'))

let persons = [
    {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
    },
    {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
    },
    {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
    },
    {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
    }
]

app.get('/info', (req, res) => {
    var responseString = `puhelinluettelossa ${persons.length} henkilön tiedot`
    var timeStamp = new Date()
    res.send(200, '<p>' + responseString + '</p><p>' + timeStamp.toString() + '</p>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    var person = persons.find( p => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name) {
        res.status(400).json({error: 'name missing'})
        return
    }
    if (!body.number) {
        res.status(400).json({error: 'number missing'})
        return
    }
    if (persons.map(p => p.name).includes(body.name)) {
        res.status(400).json({error: 'name already exists'})
        return
    }
    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 10000000)
    }
    persons = persons.concat(person)

    res.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
