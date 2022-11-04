const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

const port = process.env.PORT || 4000
app.use(express.json())
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to GoSport Back End.' })
})

//** */
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
// **
app.use('/teams', require('../routes/teamRoute'))
app.listen(port, () => {
  console.log('Server Connected ' + port)
})
