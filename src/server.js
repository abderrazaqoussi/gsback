require('dotenv').config({ path: __dirname + '/../.env' }) // use Envirement variable

const express = require('express') // import Express
const passport = require('passport')

const app = express()

const cors = require('cors')
app.use(
  cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true, // enable HTTP cookies over CORS
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

const bodyParser = require('body-parser')
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
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
app.get('/signin', (req, res) => {
  res.redirect(`${process.env.SERVER_URL}/auth/google`)
})
// app.use(cors())
// >>>> Start Server
const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Server Connected To : http://localhost:${port}`)
})
