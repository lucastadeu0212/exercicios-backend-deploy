const express = require('express');
const rotas = require('./router/rotas');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use(rotas);

app.listen(3000);