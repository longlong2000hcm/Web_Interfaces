const express = require('express');
const router = express.Router();
const fs = require('fs')

const getJSON = (filePath) => {
    file = fs.readFileSync(filePath);
    data = JSON.parse(file);
    return data.data;
}

var productsArray = getJSON("./data/products.json");

router.get('/:property/:value', (req, res) => {
    const property = req.params.property;
    console.log("Search route invoked")
    console.log(`Searching for product with ${property} = ${req.params.value}`)
    console.log("products array: ", productsArray);
    const results = productsArray.filter(product =>
        product[property] === req.params.value
    )
    res.send(results);
})

module.exports = router;