// ** Require Modules
const express = require('express') // Express
require('./database/connect') // Connection To DB
const passport = require('passport')

//
require('./auth/passportConfig')
require('./auth/googleConfig')
require('./auth/stravaConfig')
require('./auth/jwtConfig')

// Server Config

const app = express()
app.use(express.json())

// Passport Config
app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(
  require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    res.send('Welcome')
  }
)

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
