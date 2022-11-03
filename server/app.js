const express = require('express');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to GoSport Back End.' });
});

app.listen(port, () => {
  console.log('Server Connected ' + port);
});
