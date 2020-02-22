const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4000;

const productComponent = require('./components/product.js');

app.use(bodyParser.json());
app.use(cors());

app.get('/hello', (req, res) => res.send('Hello GET World!'));

app.use('/products', productComponent);

app.listen(port, ()=>{
    console.log(`API listening on http://localhost:${port}\n`);
})