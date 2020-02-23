const express = require('express');
const has = require('has-value');
const router = express.Router();
const fs = require('fs')
var multer = require('multer')
var upload = multer({ dest: './images' });

const getJSON = (filePath) => {
    file = fs.readFileSync(filePath);
    data = JSON.parse(file);
    return data.data;
}


function validateContentTypeHeaders(req, res, next) {
    if (req.is('multipart/form-data') === 'multipart/form-data') {
        next();
    }
    else {
        res.status(400).send('Bad Request - Missing Headers');
    }
}


/* Middleware to validate product creation */
function validateNewProduct(req, res, next) {
    var err = new Error;
    const textFieldRequired = [
        'title', 'description', 'category',
        'location', 'price', 'dateOfPosting',
        'deliveryType', 'sellerInfo'
    ]
    let errorArray = [];
    textFieldRequired.forEach(x => {
        if (has(req.body, x) == false) {
            errorArray.push(x);
            err.message += 'Missing or empty ' + x + '\n';
        }
    })
    if (has(req.files, 'images') == false) {
        errorArray.push('image');
        err.message += "Missing or empty image";
    }
    if (errorArray.length > 0) {
        res.status(400).send(err.message);
    }
    else {
        next();
    }
}

var productsArray = getJSON("./data/products.json");

router.get('/', (req, res) => {
    //fs.writeFileSync("./data/products.json", JSON.stringify({data: productsArray}));
    res.json(productsArray);
});

var cpUpload = upload.fields([{ name: 'images', maxCount: 4 }])
router.post('/',
    validateContentTypeHeaders,
    cpUpload,
    validateNewProduct
    ,
    (req, res) => {
        let imageArray = req.files['images'].map(image => {
            fs.renameSync(image.path, './images/' + image.originalname);
            console.log('renamed complete');
            return image.originalname;
        });
        console.log(imageArray);
        let newProduct = {
            id: productsArray.length + 1,
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            location: req.body.location,
            images: imageArray,
            price: req.body.price,
            dateOfPosting: req.body.dateOfPosting,
            deliveryType: req.body.deliveryType,
            sellerInfo: req.body.sellerInfo
        }
        productsArray.push(newProduct);
        fs.writeFileSync("./data/products.json", JSON.stringify({ data: productsArray }, null, 2));
        res.status(201);
        res.json(newProduct);
    });

router.put('/:id', validateContentTypeHeaders, cpUpload, (req, res) => {
    let badRequest = false;
    if (Object.prototype.hasOwnProperty.call(req.files, 'images')) {
        var imageArray = req.files['images'].map(image => {
            fs.renameSync(image.path, './images/' + image.originalname);
            console.log('renamed complete');
            return image.originalname;
        });
    }
    for (let prop in req.body) {
        if (!Object.prototype.hasOwnProperty.call(productsArray[req.params.id-1], prop)) {
            badRequest = true;
            res.sendStatus(400);
        }
    }
    if (badRequest === false) {
        for (let prop in req.body) {
            if (prop !== 'images') {
                productsArray[req.params.id-1].prop = req.body.prop;
            }
        }
        if (req.files.images) {
            productsArray[req.params.id-1].images = imageArray;
        }
        fs.writeFileSync("./data/products.json", JSON.stringify({ data: productsArray }, null, 2));
        res.sendStatus(200);
    }

})

router.delete('/:id', (req,res) => {
    if (req.params.id<=productsArray.length) {
        productsArray.splice(req.params.id-1,1);
        fs.writeFileSync("./data/products.json", JSON.stringify({ data: productsArray }, null, 2));
        res.sendStatus(200);
    } 
    else {
        res.sendStatus(400);
    }
})

module.exports = router;