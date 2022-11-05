// Code from >>> https://theholmesoffice.com/mongoose-connection-best-practice/
require('dotenv').config({ path: __dirname + '/../../.env' })
// Bring Mongoose into the app
let mongoose = require('mongoose')

// Build the connection string
let dbURI = process.env.MONGODB_URI

// Create the database connection
mongoose.connect(dbURI, {
  useNewUrlParser: 'true',
})

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection is open')
})

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error : ' + err)
})

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected')
})

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log(
      'Mongoose default connection disconnected through app termination'
    )
    process.exit(0)
  })
})
