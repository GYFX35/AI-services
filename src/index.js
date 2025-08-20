const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const roles = require('./roles');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/roles', (req, res) => {
  res.json(roles);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
