const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Users = require('../users/usersModel.js')

//Middleware

//Requests the session cookie and user if valid let them through.
function restricted(req, res, next){
    try{
        if(req && req.session && req.session.user){
          next()
        }else{
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      }catch(error){
        res.status(500).json({message: 'You broke it!'})
      }
}

//Register User
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

//request session cookie and if successful log user in 
router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
    .first()
    .then(user => {
        if (user && bcrypt.compareSync(password, user.password)){
            req.session.user = user;

            res.status(200).json({message: `Welcome back ${user.username}!`})
        }else{
            res.status(401).json({ message: `You shall not pass!`})
        }
    }).catch( error => {
        res.status(500).json(error)
    });
});

//Destroy's session and Logs the user out
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if(err){
        res.status(500).json({message: 'There was an error logging out'})
      }else{
        res.status(200).json({message: 'Logout Successful'})
      }
    })
  })


router.get('/users', restricted, (req, res)=> {
    Users.find().then(users => {
        res.status(200).json({users})
    }).catch(error => {
        res.status(500).json(error)
    })
})

module.exports = router;