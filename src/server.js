// use Envirement variable
require('dotenv').config({ path: __dirname + '/../.env' })

// Import Modules
const express = require('express')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const cors = require('cors')

// Connection To DB
require('./database/connect')

// Use Passport Config
require('./auth/passportConfig')

// Use Express
const app = express()

// Use Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
)
app.use(express.json())

app.use(cookieParser())

app.use(passport.initialize())

//  Use Routes

app.use('/auth', require('./routes/authRoute'))
app.use('/api/v1/teams', require('./routes/teamRoute'))
app.use('/api/v1/users', require('./routes/userRoute'))

app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Hello From GoSports :)' })
})

// Start Server
const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Server Connected To : http://localhost:${port}`)
})
