const express = require('express');
const router = express.Router();
const fs = require('fs')
var multer = require('multer')
var upload = multer()
const bcrypt = require('bcryptjs');

const getJSON = (filePath) => {
    file = fs.readFileSync(filePath);
    data = JSON.parse(file);
    return data.data;
}

const usersArray = getJSON("./data/users.json");

router.post('/register', upload.none(), (req, res) => {
    let username = req.body.username.trim();
    let password = req.body.password.trim();

    if ((typeof username === "string") &&
        (username.length > 4) &&
        (typeof password === "string") &&
        (password.length > 4)) {
        bcrypt.hash(password, saltRounds).then(hash => {
            usersArray.push({username: username, password: hash});
            fs.writeFileSync("./data/users.json", JSON.stringify({ data: usersArray }, null, 2));
            res.sendStatus(201);
        })
    }
    else {
        res.status(400).send("incorrect username or password, both must be strings and username more than 4 long and password more than 6 characters long");
    }
})