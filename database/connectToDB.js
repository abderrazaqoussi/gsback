// ** import Modules
const mongoose = require('mongoose')
require('dotenv').config()

if (!process.env.MONGODB_URI) {
  console.log('pls add mongo uri')
}
// Set DB URI
const DB_URI = process.env.MONGODB_URI

// Set Connection Options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

// Connect to Mongodb
mongoose.connect(DB_URI, options).then(() => {
  console.log('Database connected')
})
