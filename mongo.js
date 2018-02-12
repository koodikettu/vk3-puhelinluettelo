const mongoose = require('mongoose')

const url = 'mongodb://mlphlu:37xE58P@ds033996.mlab.com:33996/puhelinluettelo'

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String,
    id: Number
})


const name = process.argv[2]
const number = process.argv[3]

if (!name && !number) {
    Person.find({}).then(result => {
        console.log('puhelinluettelo:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
} else if (!!name && !!number) {
    person = new Person({
        name: name,
        number: number
    })
    person.save().then(response => {
        console.log(`lisätään henkilö ${name} numero ${number}`)
        mongoose.connection.close()
    })
} else {
    console.log('no operation')
    mongoose.connection.close()
}


