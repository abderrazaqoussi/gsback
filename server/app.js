const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to GoSport Back End.' })
})

// >>>> Connect to Mongodb
if (!process.env.MONGODB_URI) {
  console.log('pls add mongo uri')
}

const DB_URI = process.env.MONGODB_URI

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
mongoose.connect(DB_URI, options).then(() => {
  console.log('Database connected')
})

// >>>> Use Routes
app.use('/api/v1/teams', require('../routes/teamRoute'))

// >>>> Start Server
const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log('Server Connected ' + port)
})
