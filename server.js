const express = require('express')

const server = express();

//Routers
const usersRouter = require('./routers/usersRouter.js')

//Middleware
server.use(express.json());
server.use('/api', usersRouter )

server.get('/', (req, res) => {
    res.send('Webauth I Challenge')
})

module.exports = server;