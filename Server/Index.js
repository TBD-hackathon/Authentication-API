
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;


app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('¡Hola Mundo!');
});


app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
