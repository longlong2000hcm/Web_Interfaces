const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(cors());

app.get('/hello', (req, res) => res.send('Hello GET World!'));

app.listen(port, ()=>{
    console.log(`API listening on http://localhost:${port}\n`);
})