const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4000;

const productComponent = require('./components/product.js');
const searchComponent = require('./components/search.js');
const registerComponent =  require('./components/register');

app.use(bodyParser.json());
app.use(cors());

app.get('/hello', (req, res) => res.send('Hello GET World!'));

app.use('/products', productComponent);
app.use('/search', searchComponent);
app.use('/register', registerComponent);



app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}\n`);
})