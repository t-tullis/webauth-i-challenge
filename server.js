const express = require('express')

const server = express();

//Routers

//Middleware
server.use(express.json());

server.get('/', (req, res) => {
    res.send('Webauth I Challenge')
})

module.exports = server;