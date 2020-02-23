const express = require('express');
const router = express.Router();
const fs = require('fs')

const getJSON = (filePath) => {
    file = fs.readFileSync(filePath);
    data = JSON.parse(file);
    return data.data;
}

const productsArray = getJSON("./data/products.json");

router.get('/:property/:value', (req, res) => {
    console.log(productsArray);
    const property = req.params.property;
    const results = productsArray.filter(product =>
        product[property] === req.params.value
    )
    res.send(results);
})

module.exports = router;