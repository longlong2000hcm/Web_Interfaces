const express = require('express');
const router = express.Router();
const fs = require('fs')
const has = require('has-value');
var multer = require('multer')
var upload = multer()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getJSON = (filePath) => {
    file = fs.readFileSync(filePath);
    data = JSON.parse(file);
    return data.data;
}

const usersArray = getJSON("./data/users.json");

function validateContentTypeHeaders(req, res, next) {
    if (req.is('multipart/form-data') === 'multipart/form-data') {
        next();
    }
    else {
        res.status(400).send('Bad Request - Missing Headers');
    }
}

router.post('/', validateContentTypeHeaders, upload.none(), (req, res) => {
    console.log("Login route invoked");
    if (!has(req.body,"username")||!has(req.body,"password")) {
        res.status(400).send("Missing username or password");
        return null;
    }
    let username = req.body.username.trim();
    let password = req.body.password.trim();
    dbResults = usersArray.filter(user => user.username === username);
    if (dbResults.length == 0) {
        res.status(401).json({
            sucess: false,
            token: null,
            err: 'Username or password is incorrect'
        });
        return null;
    }
    bcrypt.compare(password, dbResults[0].password).then(bcryptResult => {
        if (bcryptResult == true) {
            let token = jwt.sign({ id: dbResults[0].idUser, username: dbResults[0].username }, 'madebyken', { expiresIn: 129600 }); // Sigining the token
            res.status(200).json({
                sucess: true,
                err: null,
                token
            });
        }
        else {
            res.status(401).send("Wrong password");
        }
    })
});


module.exports = router;