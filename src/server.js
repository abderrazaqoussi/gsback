// Express
const express = require('express') // Express
const app = express()

// Connection To DB
require('./database/connect')

//
const passport = require('passport')
const cookieParser = require('cookie-parser')
app.use(
  require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  })
)

//
require('./auth/passportConfig')

//
app.use(express.json())
app.use(cookieParser())

// Initialize Passport and restore authentication state.
app.use(passport.initialize())

// >>>> Use Routes
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to GoSport Back End.' })
})
app.use('/auth', require('./routes/authRoute'))
app.use('/api/v1/teams', require('./routes/teamRoute'))
app.use('/api/v1/users', require('./routes/userRoute'))

// >>>> Start Server
const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log('Server Connected ' + port)
})
