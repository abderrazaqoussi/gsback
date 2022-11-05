// ** Require Modules
const express = require('express') // Express
require('./database/connect') // Connection To DB

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to GoSport Back End.' })
})

// >>>> Use Routes
app.use('/api/v1/teams', require('./routes/teamRoute'))

// >>>> Start Server
const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log('Server Connected ' + port)
})
