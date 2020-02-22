const express = require('express');
const has = require('has-value');
const router = express.Router();
const fs = require('fs')

const getJSON = (filePath) => {
    file = fs.readFileSync(filePath);
    data = JSON.parse(file);
    return data.data;
}

var productsArray = getJSON("./data/products.json");

router.get('/', (req, res) => { 
    fs.writeFileSync("./data/products.json", JSON.stringify({data: productsArray}));
    res.json(productsArray); 
});



module.exports = router;