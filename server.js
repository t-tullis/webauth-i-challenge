const express = require('express')
const cors = require('cors')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session);

const configureKnex = require('./data/dbConfig.js')

const server = express();

const sessionConfig = {
    name: 'webchallenge',
    //encrypts cookie
    secret: 'oh yeah this is a big secret',
    cookie: {
      maxAge: 1000 * 60 * 10,
      secure: false, // use cookie over https 
      httpOnly: true, //false means JavaScript can access the cookie on the client
    },
    resave: false, // avoid recreating unchanged sessions
    saveUninitialized: false, //GDPR compliance
    //uses our database
    store: new KnexSessionStore({
        knex: configureKnex,
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 1000 * 60 * 30, // Deletes expired sessions
    }),
  }

//Routers
const usersRouter = require('./routers/usersRouter.js')

//Middleware
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));
server.use('/api', usersRouter )

server.get('/', (req, res) => {
    res.send('Webauth I Challenge')
})

module.exports = server;