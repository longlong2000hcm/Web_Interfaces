const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 8000;

const productComponent = require('./components/product.js');
const searchComponent = require('./components/search.js');
const registerComponent =  require('./components/register');
const loginComponent = require('./components/login');

app.use(bodyParser.json());
app.use(cors());

app.use('/products', productComponent);
app.use('/search', searchComponent);
app.use('/register', registerComponent);
app.use('/login', loginComponent);



app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}\n`);
})