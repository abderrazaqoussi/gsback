require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const passport = require('passport')
const cookieSession = require('cookie-session')
const authRoute = require('./../routes/auth')
const app = express()

app.use(
  cookieSession({
    name: 'session',
    keys: ['cyberwolve'],
    maxAge: 24 * 60 * 60 * 100,
  })
)

app.use(passport.initialize())
app.use(passport.session())
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methodes: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
)
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to GoSport Back End.' })
})

app.use('/auth', authRoute)
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
app.use('/api/v1/teams', require('./../routes/teamRoute'))

// >>>> Start Server
const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log('Server Connected ' + port)
})
