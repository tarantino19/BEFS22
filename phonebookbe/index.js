const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')


app.use(express.json())
app.use(cors())
app.use(express.static('build'))


morgan.token("data", (request) => {
  return request.method ? JSON.stringify(request.body) : " "; ;
}); //this is the most basic one to show logger

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/info', (request, response) => {
  const responseInfo = `
  Phonebook has info for ${persons.length} people
  <br/>
  ${new Date ()}`
  response.send(responseInfo)
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
        .then((person) => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end();
    }
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = (request.params.id)
  persons = persons.filter(person => person.id !== id)
  // for delete, persons being filtered has to be not equal to the id 
  response.status(204).end()
})

//post request

// const generateId = () => {
//   const personId = persons.length > 0
//     ? Math.max(...persons.map(n => n.id))
//     : 0
//   return personId + 1
// }

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name is missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson=> {
    response.json(savedPerson)
  })
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }

// app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
