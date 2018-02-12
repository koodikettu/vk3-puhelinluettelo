const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')




morgan.token('body', function(req, res) { return JSON.stringify(req.body)})
morgan.format('custom', ':method :url :body :res[content-length] - :response-time ms')

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('custom'))

const formatPerson = (person) => {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

app.get('/info', (req, res) => {
    var responseString = `puhelinluettelossa ${persons.length} henkilön tiedot`
    var timeStamp = new Date()
    res.send(200, '<p>' + responseString + '</p><p>' + timeStamp.toString() + '</p>')
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(formatPerson))
    }).catch(error => {
        console.log(error)
    })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(response => {
        if (response) {
            res.json(formatPerson(response))
        } else {
            res.status(404).end()
        }
    }).catch(error => {
        console.log(error)
    })

})

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndRemove(req.params.id).then(response => {
        res.status(204).end()
    }).catch(error => {
        console.log(error)
    })
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
    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(response => {
        res.json(formatPerson(response))
    }).catch(error => {
        console.log(error)
    })
})

app.put('/api/persons/:id', (req, res) => {
    const person = req.body
    Person.findByIdAndUpdate(req.params.id, person).then(response => {
        res.json(formatPerson(response))
    }).catch(error => {
        console.log(error)
    })

})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
