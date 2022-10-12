const express = require('express')
const app = express()
const morgan = require('morgan')


app.use(express.json())

morgan.token("data", (request) => {
  return request.method ? JSON.stringify(request.body) : " "; ;
}); //this is the most basic one to show logger

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);


let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello Persons</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const responseInfo = `
  Phonebook has info for ${persons.length} people
  <br/>
  ${new Date ()}`
  response.send(responseInfo)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.statusMessage = "This person does not exist...yet"
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

//post request

const generateId = () => {
  const personId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return personId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  const person = {
    id: generateId (),
    name: body.name,
    number: body.number,
  }

  const existingNames = persons.find (person => {
    return person.name === body.name
  } ) // returns a comparison value...then below "if existingNames is true..return status 400"

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Name or number is missing' 
    })
  } else if (existingNames) {
    return response.status(400).json({ 
      error: 'Name must be unique' 
    })
  }

  persons = persons.concat(person)
  response.json(person)
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }

// app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})