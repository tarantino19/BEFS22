const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

morgan.token("data", (request) => {
  return request.method ? JSON.stringify(request.body) : " "; ;
}); //this is the most basic one to show logger

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);


app.use(express.json())
app.use(cors())
app.use(express.static('build'))

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

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

  // for delete, persons being filtered has to be not equal to the id 

//post request

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

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
        .then((person) => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end();
    }
  })
  .catch(error => next(error))
  })

  app.put("/api/persons/:id", (request, response, next) => {
    const { name, number } = request.body;
    Person.findByIdAndUpdate(
      request.params.id,
      { name, number },
    )
      .then((updatedPerson) => {
        response.json(updatedPerson);
      })
      .catch((error) => next(error));
  });


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }

// app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
