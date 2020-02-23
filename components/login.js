const express = require('express');
const router = express.Router();
const fs = require('fs')
var multer = require('multer')
var upload = multer()
const bcrypt = require('bcryptjs');
const saltRounds = 4;
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');

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

router.post('/', (req, res) => {
    let username = req.body.username.trim();
    let password = req.body.password.trim();
    usersArray.find(user=>user.username===username).then(dbResults => {
        if(dbResults.length == 0)
        {
          return res.status(401).json({
            sucess: false,
            token: null,
            err: 'Username or password is incorrect'
        });
        }
        bcrypt.compare(password, dbResults[0].password).then(bcryptResult => {
          if(bcryptResult == true)
          {
            let token = jwt.sign({ id: dbResults[0].idUser, username: dbResults[0].username }, 'madebyken', { expiresIn: 129600 }); // Sigining the token
            res.status(200).json({
                sucess: true,
                err: null,
                token
            });
          }
          else
          {
            return res(null, false);
          }
        })
    
      }).catch(dbError => cb(err))
    });
    

module.exports = router;