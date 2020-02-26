const express = require('express');
const router = express.Router();
const fs = require('fs')
const has = require('has-value');
var multer = require('multer')
var upload = multer()
const bcrypt = require('bcryptjs');
const saltRounds = 4;

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
    console.log("Register route invoked");
    if (!has(req.body,"username")||!has(req.body,"password")) {
        res.status(400).send("Missing username or password");
        return null;
    }

    let username = req.body.username.trim();
    let password = req.body.password.trim();

    if ((typeof username === "string") &&
        (username.length > 4) &&
        (typeof password === "string") &&
        (password.length > 4)) {
        bcrypt.hash(password, saltRounds).then(hash => {
            usersArray.push({ idUser: usersArray.length+1, username: username, password: hash });
            fs.writeFileSync("./data/users.json", JSON.stringify({ data: usersArray }, null, 2));
            res.sendStatus(201);
        })
    }
    else {
        res.status(400).send("incorrect username or password, both must be strings and username more than 4 long and password more than 6 characters long");
    }
})

module.exports = router;