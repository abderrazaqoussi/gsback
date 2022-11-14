require('dotenv').config({ path: __dirname + '/../.env' }) // use Envirement variable

const express = require('express') // import Express
const passport = require('passport')

const app = express()

var cors = require('cors') //import cors module

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
  })
)

require('./database/connect') // Connection To DB

app.use(
  require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  })
)

app.use(express.json())

// const bodyParser = require('body-parser')
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// )
app.use(require('cookie-parser')())

require('./auth/passportConfig')

app.use(passport.initialize()) // Initialize Passport and restore authentication state.

// >>>> Use Routes

app.use('/auth', require('./routes/authRoute'))
app.use('/api/v1/teams', require('./routes/teamRoute'))
app.use('/api/v1/users', require('./routes/userRoute'))

app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Hello From GoSports :)' })
})

// >>>> Start Server
const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Server Connected To : http://localhost:${port}`)
})
