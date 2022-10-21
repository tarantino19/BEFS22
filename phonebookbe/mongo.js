const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://tolentinored19:${password}@phonebook.az1a1bi.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)



const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});


const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 3) {
  const name = process.argv[3] //assigning 3rd index to name
  const number = process.argv[4] //assigning 4th index to name

  const person = new Person ({
    name: name,
    number: number,
})

person.save ().then (() => {
  console.log(`added name: ${name} and number: ${number} to the phonebook`);
  mongoose.connection.close();
})
}


//this one is for logging each list in the phonebook
if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
}


// Person
//   .find({})
//   .then(persons=> {
//     // ...
//   })

// mongoose.connection.close()
//In the code above the mongoose.connection.close() command will get executed immediately after the Person.find operation is started. This means that the database connection will be closed immediately, and the execution will never get to the point where Person.find operation finishes and the callback function gets called.


//The new entry to the phonebook will be saved to the database. Notice that if the name contains whitespace characters, it must be enclosed in quotes:
//ex  node mongo.js yourpassword "Arto Vihavainen" 045-1232456
// because of the whitespace - for the argument