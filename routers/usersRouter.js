const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/usersModel.js')

//Middleware
function restricted(req, res, next){
    let {username, password} = req.headers;

    if(username && password){
        Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)){
                res.status(200).json({message: `Welcome back ${user.username}!`})
            }else{
                res.status(401).json({ message: `You shall not pass!`})
            }
        }).catch( error => {
            res.status(500).json(error)
        });
    }else{
        res.status(401).json({error: "Please provide credentials"})
    }
}

router.post('/register', (req, res) => {
    let user = req.body;
    
    const hash = bcrypt.hashSync(user.password, 2)
    user.password = hash

    Users.addUser(user).then(savedUser => {
        res.status(201).json(savedUser)
    }).catch(error => {
        res.status(500).json(error)
    })
})

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
    .first()
    .then(user => {
        if (user && bcrypt.compareSync(password, user.password)){
            res.status(200).json({message: `Welcome back ${user.username}!`})
        }else{
            res.status(401).json({ message: `Invalid Credentials`})
        }
    }).catch( error => {
        res.status(500).json(error)
    });
});

router.get('/users', restricted, (req, res)=> {
    Users.find().then(users => {
        res.status(200).json({users})
    }).catch(error => {
        res.status(500).json(error)
    })
})

module.exports = router;